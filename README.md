# aert

Building slowly.

* Interface / UI
  * Svelte integration? how to include it within workflow
* camera follow object
  * on hold while three.js moves to es6 classes then its `class Foo extends Firstpersoncontrols`
  * maybe extend firstpersoncontrols instead of orbitalcontrols
  * user input moves object with WASD keys
* inventory of objects
* place objects into world
  * basic shape to random location

Food for thought:

* RxJS -> signals graphing i.e. interrupt based programming for ui
* In-World editor interface with context switching

# The build Folder

The build folder contains some files that are manually placed there.

* `./three.module.js` from `three/build`
* `./jsm/**/*.js` from `three/examples/jsm`

The typescript compiler also compiles files from `src/` into the `build/` folder

The Deno script automatically edits the urls within the build folder to point to the manually placed scripts.