/// <reference lib="dom" />
import { Tweakpane } from "./deps.ts";
import { spinningCubeWorld } from "./worlds/spinningCubeWorld.ts";

// ---------------- Variables --------------------
// tweakpane
export const pane = new Tweakpane.default();
// pane.addInput({})
const tsave = pane.addButton({ title: "save" });
tsave.on("click", () => {
  console.log("Hello world");
});

const world = new spinningCubeWorld();

// ---------------- Functions --------------------

// ---------------- Events --------------------
