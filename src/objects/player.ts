// handles the player object appropriately
import { PlayerControls } from "../controls/PlayerControls.ts";
import { Cube } from "./cube.ts";
import { MeshStandardMaterial, CircleGeometry } from "../deps.ts";
import type { Scene } from "../scene.ts"

// controls trigger events here
// access the model
export class Player {
  controls
  object
  circle
  constructor(camera, domEl) {
    this.object = new Cube({ material: new MeshStandardMaterial({ color: 0x00ff00 }) })
    this.object.castShadow = true;
    this.object.receiveShadow = true;
    this.object.name = "player";

    this.controls = new PlayerControls(this.object, camera, domEl)
    this.circle = new CircleGeometry(2, 5, Math.PI/4, Math.PI/2)
  }

  addtoScene(scene:Scene) {
    scene.add(this.circle)
  }
}