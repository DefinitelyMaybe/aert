/// <reference lib="dom" />
import { Tweakpane } from "./deps.ts";
import { spinningCubeWorld } from "./worlds/spinningCubeWorld.ts";
import { BoxesWorld } from "./worlds/boxesWorld.ts";
import { Scene } from "./scene.ts";


// ---------------- Variables --------------------
let world: spinningCubeWorld | BoxesWorld;
const scene = new Scene()

// tweakpane
export const pane = new Tweakpane.default();
// pane.addInput({})
const spinningCube = pane.addButton({ title: "Spinning Cube" });
spinningCube.on("click", () => {
  console.log("loading spinning cube");
  world.dispose()
  world = new spinningCubeWorld({scene:scene});
});
const tsave = pane.addButton({ title: "Boxes" });
tsave.on("click", () => {
  console.log("loading boxes");
  world.dispose()
  world = new BoxesWorld({scene:scene});
});

world = new spinningCubeWorld({scene:scene});

// ---------------- Functions --------------------

// ---------------- Events --------------------
