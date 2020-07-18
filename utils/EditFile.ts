const decoder = new TextDecoder()
const encoder = new TextEncoder()

const data = Deno.readFileSync("./src/mod.ts")

let text  = decoder.decode(data);
text = text.replaceAll(/.+/g, (m)=> {
  let f = m.match(/\.\..+.js/g)
  if (f) {
    let s = f[0].substring(0, f[0].length-3)
    return `// @deno-types="${s}.d.ts"\n${m}`
  } else {
    return "hello world"
  }
})

//console.log(text)
Deno.writeFileSync("./src/mod1.ts", encoder.encode(text))
