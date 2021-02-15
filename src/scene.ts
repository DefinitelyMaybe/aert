import type { Cube } from "./objects/cube.ts";
import { Scene as ThreeScene } from "./deps.ts";
import { world } from "./main.ts";

export class Scene extends ThreeScene {
  constructor() {
    super();
  }

  add(obj) {
    if (obj.body) {
      // add to  physics
      super.add(obj);
      world.addBody(obj.body);
    } else {
      // normal add
      super.add(obj);
    }
    return this;
  }

  remove(obj: Cube) {
    if (obj.body) {
      // remove from scene and physics world
      super.remove(obj);
      world.addBody(obj.body);
    } else {
      // normal add
      super.remove(obj);
    }
    return this;
  }
}
