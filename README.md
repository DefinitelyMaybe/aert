# aert

Making a random prototype slowly.

* camera
  * not going through ground
* physics
  * render debugging shapes
* inventory of objects
* place objects into world
* How to customize three.js
* In-World editor interface with context switching

# Developing

The following deno script outputs a `build` folder. The watch-and-rebuild script also watches for file changes and only updates the files which have changed. The main.html page will not work statically and must be served up by a server. [Live Server](https://ritwickdey.github.io/vscode-live-server/) works nicely.

`deno run -A --unstable .\utils\watch-and-rebuild.ts`

