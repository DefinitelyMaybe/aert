import {
  emptyDirSync,
  ensureFileSync,
} from "https://deno.land/std/fs/mod.ts";

const BUILD = "build/";
const BUILDJAVASCRIPT = "build/js/";
const VIEWS = "views/";
const SRC = "src/";

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
console.log("compiling from main...");
// @ts-ignore
const [errors, emitted] = await Deno.compile(
  `${SRC}main.ts`,
  undefined,
  {
    lib: ["esnext"],
  },
);

if (errors == null) {
  console.log("writing js to file:");
  for (const obj in emitted) {
    if (obj.includes("file:///")) {
      const splitPath = obj.split("src/");
      const path = splitPath[splitPath.length - 1];
      const buildPath = `${BUILDJAVASCRIPT}${path}`;
      console.log(buildPath);
      ensureFileSync(buildPath);
      const data = emitted[obj].replace(/\.ts/g, ".js");
      Deno.writeTextFileSync(buildPath, data);
    } else {
      // console.log(`Not written to build: ${obj}`);
    }
  }
  console.log("building finished");
} else {
  console.error(errors);
}
