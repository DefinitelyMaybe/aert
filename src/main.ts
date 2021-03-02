/// <reference lib="dom" />
import { Tweakpane } from "./deps.ts";
import { spinningCubeWorld } from "./worlds/spinningCubeWorld.ts";
import { BoxesWorld } from "./worlds/boxesWorld.ts";

// ---------------- Variables --------------------
let world: spinningCubeWorld | BoxesWorld;

// tweakpane
export const pane = new Tweakpane.default();
// pane.addInput({})
const spinningCube = pane.addButton({ title: "Spinning Cube" });
spinningCube.on("click", () => {
  world.dispose()
  world = new spinningCubeWorld();
});
const tsave = pane.addButton({ title: "Boxes" });
tsave.on("click", () => {
  world.dispose()
  world = new BoxesWorld();
});

world = new spinningCubeWorld();

// ---------------- Functions --------------------

// ---------------- Events --------------------
