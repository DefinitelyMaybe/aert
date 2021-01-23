import {
  emptyDirSync,
  ensureFileSync,
  walkSync,
} from "https://deno.land/std/fs/mod.ts";

const DIST = "dist/";
const DISTJS = "dist/js/";
const CONFIGS = "configs/";
const SRC = "src/";
const STYLES = "styles/";
const VIEWS = "views/";

// the config to know which html and style sheets to copy
// use a default
let name = "main"
if (Deno.args[0]) {
  // use args to figure out which config to load
  name = Deno.args[0]
}

let config = Deno.readTextFileSync(`${CONFIGS}${name}.json`);
config = JSON.parse(config)

console.log(config);


console.log("building...");
// try to empty the build folder
try {
  console.log("emptying build folder");
  emptyDirSync(DIST);
} catch (error) {
  console.error(`Didn't manage to empty the build folder.`);
}


// copy html and css
console.log("copying html files");
const html = Deno.readTextFileSync(`${VIEWS}${name}.html`);
Deno.writeTextFileSync(`${DIST}${name}.html`, html);

console.log("copying css files");
const css = Deno.readTextFileSync(`${STYLES}${name}.css`);
Deno.writeTextFileSync(`${DIST}${name}.css`, css);

// compile src scripts with deno
console.log("transpiling all of src...");

for (const entry of walkSync(SRC)) {
  if (entry.isFile) {
    let path = entry.path.replaceAll("\\", "/").split("src/")[1].replace(".ts", ".js");
    const buildPath = `${DISTJS}${path}`;
    
    // @ts-ignore
    const js = await Deno.emit(
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
