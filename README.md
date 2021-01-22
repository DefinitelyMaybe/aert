# aert

Fail fast and always aim for fun.

* interactions
  * place objects into world
* [jumping](https://www.youtube.com/watch?v=hG9SzQxaCm8&ab_channel=GDC)
* inventory
* abilities

# Developing

The following deno script outputs a `dist` folder. The watch-and-rebuild script also watches for file changes and only updates the files which have changed. The html pages must be served up by a server as es modules are in use. [Live Server](https://ritwickdey.github.io/vscode-live-server/) works nicely.

`deno run -A --unstable .\utils\watch-and-rebuild.ts`

