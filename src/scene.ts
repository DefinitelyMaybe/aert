import type { Cube } from "./objects/cube.ts";
import { Scene as ThreeScene } from "./deps.ts";
import { World } from "./deps.ts";

export class Scene extends ThreeScene {
  physics = new World()
  constructor() {
    super();
  }

  add(obj) {
    if (obj.body) {
      // add to  physics
      super.add(obj);
      this.physics.addBody(obj.body);
    } else {
      // normal add
      super.add(obj);
    }
    return this;
  }

  remove(obj) {
    if (obj.body) {
      // remove from scene and physics world
      super.remove(obj);
      this.physics.addBody(obj.body);
    } else {
      // normal add
      super.remove(obj);
    }
    return this;
  }
}
