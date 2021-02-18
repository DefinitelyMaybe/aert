import type { PerspectiveCamera } from "../deps.ts";
import { TopDownControls } from "../controls/topDownControls.ts";
import { Cube } from "./cube.ts";
import { MeshStandardMaterial, Object3D } from "../deps.ts";

// TODO-DefinitelyMaybe: change the model to a capsule (CylinderGeometry + ExtrudeGeometry) - https://threejsfundamentals.org/threejs/lessons/threejs-primitives.html
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

    this.controls = new TopDownControls(this.mesh, camera, domEl);
    // this.controls = new ThirdPersonControls(this.mesh, camera, domEl);
    // this.circle = new CircleGeometry(2, 5, Math.PI/4, Math.PI/2)
  }
}
