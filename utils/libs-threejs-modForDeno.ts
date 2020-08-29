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

function updateScripts(path: string) {
  // update .js script imports with deno appropriate urls
  let data = Deno.readTextFileSync(path);

  // match the import
  data = data.replaceAll(/import .+?;/gms, (m) => {
    m = m.replace(/build\/three.module.js/g, "src/Three.js");
    return m;
  });

  // write the new text to the same path
  Deno.writeTextFileSync(path, data);
}

function updateTypescripts(path: string) {
  // update .d.ts script imports with deno appropriate urls
  let data = Deno.readTextFileSync(path);

  // match imports
  data = data.replaceAll(/import .+?;/gms, (m) => {
    if (!m.includes(".d.ts")) {
      m = `${m.slice(0, m.length - 2)}.d.ts${m.slice(m.length - 2)}`;
    }
    return m;
  });

  // match exports
  data = data.replaceAll(/export \* from .+?;/gms, (m) => {
    if (!m.includes(".d.ts")) {
      m = `${m.slice(0, m.length - 2)}.d.ts${m.slice(m.length - 2)}`;
    }
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
  loopDirAndMatch(examplesPath, /.js/g, updateScripts);

  // Add types reference to top of src/Three.js [/// <reference types="..." />]
  // If needed, add '/// <reference lib="dom" />' to the top of src/Three.js as well
  let THREEJS = Deno.readTextFileSync("./libs/three.js/src/Three.js");
  if (!THREEJS.includes('<reference types="./Three.d.ts"')) {
    THREEJS = THREEJS.replace(
      /^/,
      `/// <reference types="./Three.d.ts" />\n/// <reference lib="dom" />\n`,
    );
  }
  Deno.writeTextFileSync("./libs/three.js/src/Three.js", THREEJS);

  // update exported types url within src/Three.d.ts
  let THREEDTS = Deno.readTextFileSync("./libs/three.js/src/Three.d.ts");
  THREEDTS = THREEDTS.replaceAll(/export \* from .+?;/gms, (m) => {
    if (!m.includes(".d.ts")) {
      m = `${m.slice(0, m.length - 2)}.d.ts${m.slice(m.length - 2)}`;
    }
    return m;
  });
  Deno.writeTextFileSync("./libs/three.js/src/Three.d.ts", THREEDTS);
}
