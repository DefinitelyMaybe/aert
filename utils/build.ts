import { emptyDirSync, walkSync } from "https://deno.land/std/fs/mod.ts";

const BUILD = "build/";
const VIEWS = "views/";
const SRC = "src/";

// remove everything from the build folder but make sure its there
emptyDirSync(BUILD);

// copy html and css
const html = Deno.readTextFileSync(`${VIEWS}main.html`);
Deno.writeTextFileSync(`${BUILD}main.html`, html);

const css = Deno.readTextFileSync(`${VIEWS}style.css`);
Deno.writeTextFileSync(`${BUILD}style.css`, css);

// compile src scripts with deno
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
} else {
  console.error(errors);
}

// change names across files
for (const entry of walkSync(BUILD)) {
  if (entry.name.endsWith("js")) {
    let data = Deno.readTextFileSync(entry.path);
    data = data.replace(/\.ts/g, ".js")
    Deno.writeTextFileSync(entry.path, data) 
  }
}
