/// <reference path="./lib.deno.d.ts" />

const decoder = new TextDecoder()
const encoder = new TextEncoder()

async function main() {
  const watcher = Deno.watchFs("build");
  for await (const event of watcher) {
    console.log(">>>> event", event);
    // { kind: "create", paths: [ "/foo.txt" ] }
    if (event.paths[0] == "C:\\Users\\rekke\\Documents\\aert\\build\\main.js") {
      let data = Deno.readFileSync("build/main.js");
      let text = decoder.decode(data);

      const match = text.match(/"three"/g)
      if (match) {
        text = text.replaceAll(/import .+?"three"/g, (m) => {
          return `${m.slice(0, m.length-6)}./three.module.js"`
        })
        text = text.replaceAll(/"three\/examples\/jsm.+?"/g, (m) => {
          return `"./${m.slice(16, m.length-1)}.js"`
        })
        data = encoder.encode(text)
        Deno.writeFileSync(event.paths[0], data)
      }
    }
  }
}

main()