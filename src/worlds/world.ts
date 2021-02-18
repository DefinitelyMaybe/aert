export interface WorldInitOptions {
  physicsenabled:false
}

export class World {
  // constructor(options:WorldInitOptions) {
    // calling new World() should construct everything for you appropriately
    // so...
    // state, renderer, scene, events ...

    // The question of gui?
    // The world's gui should be owned by the world
    // not called in by elements outside of the world

    // but...

    // Providing a import/export - save/load would probably be fairly useful
    
  // }

  save() {
    console.log("WIP");
  }

  load() {
    console.log("WIP");
  }

  // animate() {}
}