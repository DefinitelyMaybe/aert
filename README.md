# aert

Fail fast and always aim for fun.

* interactions
  * place objects into world
* [jumping](https://www.youtube.com/watch?v=hG9SzQxaCm8&ab_channel=GDC)
* inventory
* abilities

# Developing

The following deno script outputs a `build` folder. The watch-and-rebuild script also watches for file changes and only updates the files which have changed. The main.html page will not work statically and must be served up by a server. [Live Server](https://ritwickdey.github.io/vscode-live-server/) works nicely.

`deno run -A --unstable .\utils\watch-and-rebuild.ts`

