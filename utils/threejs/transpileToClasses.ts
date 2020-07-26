import { ensureDirSync } from "https://deno.land/std/fs/mod.ts"

const decoder = new TextDecoder()
const encoder = new TextEncoder()

const OUTPUT_FOLDER = "./OUTPUT"

// create output dir
ensureDirSync(OUTPUT_FOLDER)

async function loopDir(path:string) {
  for (const dirEntry of Deno.readDirSync(path)) {
    if (dirEntry.isDirectory) {
      loopDir(`${path}/${dirEntry.name}`)
    } else {
      // look for .d.ts files
      const threeJSTypes = dirEntry.name.match(/.d.ts/g)
      const threeJSScripts = dirEntry.name.match(/.js/g)
      
      if (threeJSTypes) {
        // Copy paste all .d.ts files
        const data = await Deno.readFile(`${path}/${dirEntry.name}`);
        await Deno.writeFile(`${OUTPUT_FOLDER}/${path}/${dirEntry.name}`, data)
      }
      
      if (threeJSScripts) {
        // regex all .js files
        transpileScript(`${path}/${dirEntry.name}`)
      }
    }
  }
}

function transpileScript(file:string) {
  // update to include .d.ts in url
  let data = Deno.readFileSync(file)
  let text = decoder.decode(data)
  const matches = text.matchAll(/import .+"/g)
  if (matches) {
    for (const match of matches) {
      const newImport = `${match[0].slice(0, match[0].length-1)}.d.ts"`
      text = text.replace(match[0], newImport)
    }
  }
  // write the new text to the same file
  data = encoder.encode(text)
  Deno.writeFileSync(file, data)
}

//read through src
loopDir("libs/three.js/src")