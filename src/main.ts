/// <reference lib="dom" />
import { Tweakpane } from "./deps.ts";
import { DevWorld } from "./worlds/devworld.ts";

// ---------------- Variables --------------------
// tweakpane
export const pane = new Tweakpane.default();
const tsave = pane.addButton({title:"save"})
tsave.on("click", ()=> {
  world.save()
})

const world = new DevWorld()

// ---------------- Functions --------------------


// ---------------- Events --------------------