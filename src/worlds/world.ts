import { WebGLRenderer, Scene } from "../deps.ts";

export class World {
  renderer;
  scene;

  constructor() {
    // the constructor builds the world appropriately
    this.renderer = new WebGLRenderer();
    this.scene = new Scene()
  }
  save(){
    return Error("Not yet implemented.")
  }
  load(){
    return Error("Not yet implemented.")
  }
  dispose(){
    this.scene.clear()
    this.renderer.dispose()
  }
}