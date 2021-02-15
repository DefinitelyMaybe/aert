import type { PerspectiveCamera } from "../deps.ts";
import { ThirdPersonControls } from "../controls/thirdPersonControls.ts";
import { Cube } from "./cube.ts";
import { MeshStandardMaterial, Object3D } from "../deps.ts";

// controls trigger events here
// access the model
// A Player has a Mesh and a controller for that mesh.
// The controller will
export class Player extends Object3D {
  domEl;
  camera;
  controls;
  mesh = new Cube({
    material: new MeshStandardMaterial({ color: 0x00ff00 }),
  });
  // circle
  constructor(camera: PerspectiveCamera, domEl: HTMLElement) {
    super();

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.name = "player";

    this.camera = camera;
    this.domEl = domEl;

    this.controls = new ThirdPersonControls(this.mesh, camera, domEl);
    // this.circle = new CircleGeometry(2, 5, Math.PI/4, Math.PI/2)
  }
}
