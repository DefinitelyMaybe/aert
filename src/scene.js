import { Scene as ThreeScene } from "./deps.js";
import { world } from "./main.js";

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
