
const watcher = Deno.watchFs("src");

for await (const event of watcher) {
  console.log(">>>> event", event);
  // { kind: "create", paths: [ "/foo.txt" ] }
  // console.log(Deno.cwd());
  Deno.run({cmd: ["deno", "run", "-A", "--unstable", "utils/build.ts"]})
}
