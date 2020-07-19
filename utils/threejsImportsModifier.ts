const decoder = new TextDecoder()
const encoder = new TextEncoder()

function loopDir(path:string) {
  for (const dirEntry of Deno.readDirSync(path)) {
    if (dirEntry.isDirectory) {
      loopDir(`${path}/${dirEntry.name}`)
    } else {
      // look for .d.ts files
      const match = dirEntry.name.match(/.d.ts/g)
      if (match) {
        updateFile(`${path}/${dirEntry.name}`)
      }
    }
  }
}

function updateFile(file:string) {
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

// some imports are single quoted i.e. '', others are double quoted ""