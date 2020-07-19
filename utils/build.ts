const decoder = new TextDecoder()

const [errors, emitted] = await Deno.bundle(
  "src/main.ts",
  {
    "src/main.ts": decoder.decode(Deno.readFileSync("src/main.ts"))
  },
  {
    lib: ["dom", "esnext"],
  },
);

// wait for deno 1.2.1
console.log(emitted)