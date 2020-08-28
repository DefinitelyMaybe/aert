/*
Overview:

- Change examples/jsm import URLS
- Add references to .d.ts files within respective .js files
  - Update .d.ts import references to include file type

extras:

- Remove all of the .html files within the  examples folder

*/

// loop through libs/three.js/examples/jsm
// find import { ... } from "../../../build/three.module.js"
// replace with import { ... } from "../../../src/Three.js"
// This is done only once, after three.js has been cloned.

const decoder = new TextDecoder();
const encoder = new TextEncoder();

const filesToDelete: string[] = [];
const examplesPath = "libs/three.js/examples/";

function loopDirAndMatch(path: string, pattern: RegExp, callBack: Function) {
  for (const dirEntry of Deno.readDirSync(path)) {
    if (dirEntry.isDirectory) {
      loopDirAndMatch(`${path}${dirEntry.name}/`, pattern, callBack);
    } else {
      // look for .d.ts files
      const match = dirEntry.name.match(pattern);
      if (match) {
        callBack(`${path}/${dirEntry.name}`);
      }
    }
  }
}

function addToDeleteList(path: string) {
  filesToDelete.push(path);
}

function updateScript(path: string) {
  // update to include .d.ts in url
  let data = Deno.readFileSync(path);
  let text = decoder.decode(data);
  const matches = text.matchAll(/import .+"/g);
  if (matches) {
    for (const match of matches) {
      const newImport = `${match[0].slice(0, match[0].length - 1)}.d.ts"`;
      text = text.replace(match[0], newImport);
    }
  }
  // write the new text to the same path
  data = encoder.encode(text);
  Deno.writeFileSync(path, data);
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
  // Delete extra .html files
  loopDirAndMatch(examplesPath, /.html/g, addToDeleteList);

  if (filesToDelete.length != 0) {
    console.log(`Some .html files were deleted from ${examplesPath}`);
    console.log(filesToDelete);
    filesToDelete.forEach((path) => {
      Deno.removeSync(path);
    });
  }

  // Delete the folders we're not using
  const UnusedFolders = [
    "./libs/three.js/.github",
    "./libs/three.js/build",
    "./libs/three.js/docs",
    "./libs/three.js/editor",
    "./libs/three.js/files",
    "./libs/three.js/test",
    "./libs/three.js/utils",
  ];

  UnusedFolders.forEach((path) => {
    if (existsSync(path)) {
      Deno.removeSync(path);
    }
  });
}

/*
patterns
some imports are single quoted i.e. '', others are double quoted ""
import {
  ...,
  ...
} from '...'

import { ... } * from '...'
*/
