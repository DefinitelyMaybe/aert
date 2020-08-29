const filesToDelete: string[] = [];
const examplesPath = "libs/three.js/examples/";
const srcPath = "libs/three.js/src/";

function loopDirAndMatch(path: string, pattern: RegExp, callBack: Function) {
  for (const dirEntry of Deno.readDirSync(path)) {
    if (dirEntry.isDirectory) {
      loopDirAndMatch(`${path}${dirEntry.name}/`, pattern, callBack);
    } else {
      // look for .d.ts files
      const match = dirEntry.name.match(pattern);
      if (match) {
        callBack(`${path}${dirEntry.name}`);
      }
    }
  }
}

function addToDeleteList(path: string) {
  filesToDelete.push(path);
}

function updatescripts(path: string) {
  // update .js script imports with deno appropriate urls
  let data = Deno.readTextFileSync(path);

  // // match the import
  data = data.replaceAll(/import .+?;/gms, (m) => {
    m = `${m.slice(0, m.length - 2)}.d.ts${m.slice(m.length - 2)}`;
    console.log(m);
    return m;
  });

  // write the new text to the same path
  // Deno.writeFileSync(path, data);
}

function updateTypescripts(path: string) {
  // update .d.ts script imports with deno appropriate urls
  let data = Deno.readTextFileSync(path);

  // console.log(data.slice(0, 100))

  // match the import
  data = data.replaceAll(/import .+?;/gms, (m) => {
    m = `${m.slice(0, m.length - 2)}.d.ts${m.slice(m.length - 2)}`;
    return m;
  });

  // write the new text to the same path
  Deno.writeTextFileSync(path, data);
}

function existsSync(path: string): boolean {
  try {
    Deno.lstatSync(path);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}

if (import.meta.main) {
  // Delete the folders/files we're not using
  const UnusedFilesAndFolders = [
    "./libs/three.js/.github",
    "./libs/three.js/build",
    "./libs/three.js/docs",
    "./libs/three.js/editor",
    "./libs/three.js/examples/files",
    "./libs/three.js/examples/fonts",
    "./libs/three.js/examples/js",
    "./libs/three.js/examples/models",
    "./libs/three.js/examples/screenshots",
    "./libs/three.js/examples/sounds",
    "./libs/three.js/examples/textures",
    "./libs/three.js/examples/files.js",
    "./libs/three.js/examples/main.css",
    "./libs/three.js/files",
    "./libs/three.js/test",
    "./libs/three.js/utils",
    "./libs/three.js/.editorconfig",
    "./libs/three.js/.gitattributes",
    "./libs/three.js/.gitignore",
    "./libs/three.js/icon.png",
    "./libs/three.js/package.json",
    "./libs/three.js/package-lock.json",
    "./libs/three.js/README.md",
  ];

  UnusedFilesAndFolders.forEach((path) => {
    if (existsSync(path)) {
      Deno.removeSync(path, { recursive: true });
    }
  });

  // Delete extra .html files within the examples folder
  loopDirAndMatch(examplesPath, /.html/g, addToDeleteList);

  if (filesToDelete.length != 0) {
    console.log(`Some .html files were deleted from ${examplesPath}`);
    console.log(filesToDelete);
    filesToDelete.forEach((path) => {
      Deno.removeSync(path);
    });
  }

  // Update .d.ts urls in remaining folders
  loopDirAndMatch(examplesPath, /.d.ts/g, updateTypescripts);
  loopDirAndMatch(srcPath, /.d.ts/g, updateTypescripts);

  // Update .js urls in the examples folder
  loopDirAndMatch(examplesPath, /.js/g, updatescripts);
  // i.e.
  // find import { ... } from "../../../build/three.module.js"
  // replace with import { ... } from "../../../src/Three.js"

  // Add types reference to top of src/Three.js
  // If needed, add '/// <reference lib="dom" />' to the top of src/Three.js
}
