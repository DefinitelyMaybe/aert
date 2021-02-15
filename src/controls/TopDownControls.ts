import type { PerspectiveCamera } from "../deps.ts";
import { MapControls } from "./MapControls.ts";

export class TopDownControls extends MapControls {
  constructor(cam:PerspectiveCamera, domEl:HTMLElement) {
    super(cam, domEl);
  }
}
