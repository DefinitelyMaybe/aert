import { WebGLRenderer } from "../deps.ts";
import { Scene } from "../scene.ts";

export interface WorldOptions {
  scene: Scene,
}

export class World {
  // renderer;
  scene;

  constructor(options?:WorldOptions) {
    // the constructor builds the world appropriately
    // this.renderer = options ? options.renderer : new WebGLRenderer();
    this.scene = options ? options.scene : new Scene();
    
  }
  save(){
    return Error("Not yet implemented.")
  }
  load(){
    return Error("Not yet implemented.")
  }
  dispose(){
    // dispose of all geometry, materials and textures
    
    // remove
    this.scene.clear()

    //
    // this.renderer.dispose()
  }
}