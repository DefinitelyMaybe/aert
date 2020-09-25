import {
  ensureDirSync,
  walkSync,
  ensureFileSync,
} from "https://deno.land/std/fs/mod.ts";

const BUILD = "build/";
const BUILDJAVASCRIPT = "build/js/";
const VIEWS = "views/";
const SRC = "src/";

// try to empty the build folder
ensureDirSync(BUILD)

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
    const path = obj.split("src/");
    const filepath = `${BUILDJAVASCRIPT}${path[path.length - 1]}`;
    ensureFileSync(filepath);
    Deno.writeTextFileSync(filepath, emitted[obj]);
  }
} else {
  console.error(errors);
}

// change names across files
for (const entry of walkSync(BUILDJAVASCRIPT)) {
  if (entry.isFile) {
    if (entry.name.endsWith("js")) {
      let data = Deno.readTextFileSync(entry.path);
      data = data.replace(/\.ts/g, ".js");
      Deno.writeTextFileSync(entry.path, data);
    } 
  }
}
