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
let name = "main.json"
if (Deno.args[0]) {
  // use args to figure out which config to load
  name = Deno.args[0]
}

const configFile = Deno.readTextFileSync(`${CONFIGS}${name}`);
const config = JSON.parse(configFile)


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
const html = Deno.readTextFileSync(`${VIEWS}${config.html}`);
Deno.writeTextFileSync(`${DIST}${config.html}`, html);

console.log("copying css files");
const css = Deno.readTextFileSync(`${STYLES}${config.style}`);
Deno.writeTextFileSync(`${DIST}${config.style}`, css);

// compile src scripts with deno
// in dev lets just transpile all of source
// we could cut down to only the files need in future
console.log(`transpiling...`); // from: ${SRC}${config.script}`);

const sources = {}

for (const entry of walkSync(SRC)) {
  if (entry.isFile) {
    // because we're working with windows paths
    let path = entry.path.replaceAll("\\", "/").split("src/")[1].replace(".ts", ".js");
    
    const buildPath = `${DISTJS}${path}`;
    
    // @ts-ignore
    const js = await Deno.emit(
      entry.path,
      {
        check: false,
        compilerOptions: {
          lib: ["esnext", "dom"],
        }
      },
    );
    console.log(js);
    // if (js["transpiled"].source) {
    //   ensureFileSync(buildPath);
    //   // replace ts with js
    //   const data = js["transpiled"].source.replace(/\.ts/g, ".js");
    //   Deno.writeTextFileSync(buildPath, data);
    // }
  }
}

// try {
//   // @ts-ignore
//   const { files } = await Deno.emit(`${SRC}${config.script}`, {
//     check: false,
//   });
//   for (const [fileName, text] of Object.entries(files)) {
//     // @ts-ignore
//     console.log(`emitted ${fileName} with a length of ${text.length}`);
//   }
// } catch (e) {
//   // something went wrong, inspect `e` to determine
// }