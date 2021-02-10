import { Scene as ThreeScene } from "./deps.ts";
import { world } from "./main.ts";

export class Scene extends ThreeScene {
  constructor() {
    super();
  }

  add(obj) {
    if (obj.body) {
      // add the physics
      super.add(obj);
      world.addBody(obj.body);
    } else {
      // normal add
      super.add(obj);
    }
  }
}
