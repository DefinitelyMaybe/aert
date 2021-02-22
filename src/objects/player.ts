import type { PerspectiveCamera, Mesh } from "../deps.ts";
import { TopDownControls } from "../controls/topDownControls.ts";
import { MeshStandardMaterial, BoxGeometry } from "../deps.ts";
import { Cube } from "./physics/cube.ts";

// TODO-DefinitelyMaybe: change the model to a capsule (CylinderGeometry + ExtrudeGeometry) - https://threejsfundamentals.org/threejs/lessons/threejs-primitives.html
export class Player extends Cube {

  controls;

  constructor(movementMesh:Mesh, camera: PerspectiveCamera, domEl: HTMLElement) {
    super();

    this.material = new MeshStandardMaterial({ color: 0x00ff00 });
    // this.geometery = new BoxGeometry(1, 2, 1);
    // this.mesh = new Mesh(this.geometery, this.material);

    // this.mesh.castShadow = true;
    // this.mesh.receiveShadow = true;
    // this.mesh.name = "player";

    this.controls = new TopDownControls(this, movementMesh, camera, domEl);
    // this.controls = new ThirdPersonControls(this.mesh, camera, domEl);
    // this.circle = new CircleGeometry(2, 5, Math.PI/4, Math.PI/2)
  }
}
