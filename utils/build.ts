const decoder = new TextDecoder()

const [errors, emitted] = await Deno.bundle(
  "src/main.ts",
  {
    "src/main.ts": 'document.getElementById("foo");'
    //decoder.decode(Deno.readFileSync("src/main.ts"))
  },
  {
    lib: ["dom", "esnext"],
  },
);

console.log(emitted)