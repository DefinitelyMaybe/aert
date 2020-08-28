# aert

Building slowly.

* Interface / UI
  * Svelte integration? how to include it within workflow
  * [making a better menu/ui](https://www.w3schools.com/howto/howto_js_dropdown.asp)
* camera follow object
  * on hold while three.js moves to es6 classes then its `class Foo extends Firstpersoncontrols`
  * maybe extend firstpersoncontrols instead of orbitalcontrols
  * user input moves object with WASD keys
* inventory of objects
* place objects into world
  * basic shape to random location
* How to customize three.js
  * [introduce a deps.ts file](https://deno.land/manual/examples/manage_dependencies)
  * Extending scripts?
* In-World editor interface with context switching

# Building

The libs folder is expected to contain the following:

* three.js
  1. `git clone --depth=1 https://github.com/mrdoob/three.js.git`
  2. `deno run -A ./utils/libs-threejs-modForDeno.ts`

To generate the build folder:

* Svelte compilation
* bundling the entry point of the app
  * a deps.ts file should be used instead of referencing the libs folder from each script.
