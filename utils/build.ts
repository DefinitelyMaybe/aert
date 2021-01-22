import {
  emptyDirSync,
  ensureFileSync,
  walkSync,
} from "https://deno.land/std/fs/mod.ts";

const BUILD = "dist/";
const BUILDJAVASCRIPT = "dist/js/";
// const CONFIGS = "configs/";
const SRC = "src/";
const VIEWS = "views/";

// For later use. the config to know which html and style sheets to copy
// if (Deno.args[0]) {

// } else {

// }
// const config = Deno.readTextFileSync(`${CONFIGS}main.html`);

console.log("building...");
// try to empty the build folder
try {
  console.log("emptying build folder");
  emptyDirSync(BUILD);
} catch (error) {
  console.error(`Didn't manage to empty the build folder.`);
}


// copy html and css
console.log("copying html files");
const html = Deno.readTextFileSync(`${VIEWS}main.html`);
Deno.writeTextFileSync(`${BUILD}main.html`, html);

console.log("copying css files");
const css = Deno.readTextFileSync(`${VIEWS}style.css`);
Deno.writeTextFileSync(`${BUILD}style.css`, css);

// compile src scripts with deno
console.log("transpiling all of src...");

for await (const entry of walkSync(SRC)) {
  if (entry.isFile) {
    let path = entry.path.replaceAll("\\", "/").split("src/")[1].replace(".ts", ".js");
    const buildPath = `${BUILDJAVASCRIPT}${path}`;
    
    // @ts-ignore
    const js = await Deno.transpileOnly(
      { "transpiled": Deno.readTextFileSync(entry.path) },
      {
        lib: ["esnext", "dom"],
      },
    );
    if (js["transpiled"].source) {
      ensureFileSync(buildPath);
      // replace ts with js
      const data = js["transpiled"].source.replace(/\.ts/g, ".js");
      Deno.writeTextFileSync(buildPath, data);
    }
  }
}
