import type { PerspectiveCamera } from "../deps.ts";
import type { Cube } from "../objects/cube.ts";
import { ThirdPersonControls } from "./thirdPersonControls.ts";

export class TopDownControls extends ThirdPersonControls {
  constructor(object:Cube, cam: PerspectiveCamera, domEl: HTMLElement) {
    super(object, cam, domEl);
  }
}
