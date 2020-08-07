# aert

Building slowly.

* camera follow object
* user input moves object
* inventory of objects
* place objects into world

Food for thought:

* RxJS -> signals graphing i.e. interrupt based programming for ui

# The build Folder

The build folder contains some files that are manually placed there.

* `./three.module.js` from `three/build`
* `./jsm/**/*.js` from `three/examples/jsm`

The typescript compiler also compiles files from `src/` into the `build/` folder

The Deno script automatically edits the urls within the build folder to point to the manually placed scripts.