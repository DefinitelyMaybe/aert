/// <reference lib="dom" />
import { Tweakpane } from "./deps.ts";
import { DevWorld } from "./worlds/devworld.ts";

// ---------------- Variables --------------------
const world = new DevWorld()

// tweakpane
export const pane = new Tweakpane.default();

// ---------------- Functions --------------------


// Events