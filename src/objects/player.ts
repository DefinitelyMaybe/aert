import type { PerspectiveCamera } from "../deps.ts";
import { PlayerWASDControls } from "../controls/3PControls.ts";
import { Cube } from "./cube.ts";
import { CircleGeometry, MeshStandardMaterial, Object3D } from "../deps.ts";

// controls trigger events here
// access the model
// A Player has a Mesh and a controller for that mesh.
// The controller will
export class Player extends Object3D {
  domEl;
  camera;
  controls;
  mesh;
  // circle
  constructor(camera:PerspectiveCamera, domEl:HTMLElement) {
    super();
    this.mesh = new Cube({
      material: new MeshStandardMaterial({ color: 0x00ff00 }),
    });
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.name = "player";

    this.camera = camera;
    this.domEl = domEl;

    this.controls = new PlayerWASDControls(camera, domEl);
    // this.circle = new CircleGeometry(2, 5, Math.PI/4, Math.PI/2)
  }
}
