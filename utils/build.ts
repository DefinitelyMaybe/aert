import { emptyDirSync, walkSync } from "https://deno.land/std/fs/mod.ts";

const BUILD = "build/";
const VIEWS = "views/";
const SRC = "src/";

// remove everything from the build folder but make sure its there
emptyDirSync(BUILD);

// copy html and css
// later rollup svelte and copy the output
const html = Deno.readTextFileSync(`${VIEWS}main.html`);
Deno.writeTextFileSync(`${BUILD}main.html`, html);

const css = Deno.readTextFileSync(`${VIEWS}style.css`);
Deno.writeTextFileSync(`${BUILD}style.css`, css);

// bundle or compile main scripts with deno
// @ts-ignore
const [errors, emitted] = await Deno.compile(
  `${SRC}main.ts`,
  undefined,
  {
    lib: ["esnext"],
  },
);

if (errors == null) {
  for (const obj in emitted) {
    const path = obj.split("/");
    const filename = path[path.length - 1];
    Deno.writeTextFileSync(`${BUILD}${filename}`, emitted[obj]);
  }
}

// change names across files
for (const entry of walkSync(BUILD)) {
  if (entry.name == "main.js") {
    let data = Deno.readTextFileSync(entry.path);
    data = data.replace(/deps.ts/g, "deps.js")
    Deno.writeTextFileSync(entry.path, data)
  }
}
