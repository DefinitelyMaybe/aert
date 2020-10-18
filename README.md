# aert

Fail fast and always aim for fun.

* interactions
  * place objects into world
  * [add html to objects](https://threejs.org/examples/#css3d_periodictable)

# Developing

The following deno script outputs a `build` folder. The watch-and-rebuild script also watches for file changes and only updates the files which have changed. The main.html page will not work statically and must be served up by a server. [Live Server](https://ritwickdey.github.io/vscode-live-server/) works nicely.

`deno run -A --unstable .\utils\watch-and-rebuild.ts`

