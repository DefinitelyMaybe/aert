import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "../deps.ts";
import type { WorldOptions } from "./world.ts";
import { World } from "./world.ts"; 

export class spinningCubeWorld extends World {
  camera;
  renderer;
  geometry;
  material;
  cube: Mesh;

  constructor(options?:WorldOptions) {
    super(options)

    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    this.renderer = new WebGLRenderer({
      canvas: document.querySelector("canvas")!,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.geometry = new BoxGeometry();
    this.material = new MeshBasicMaterial({ color: 0x00ff00 });

    this.cube = new Mesh(this.geometry, this.material);
    this.scene.add(this.cube);

    this.camera.position.z = 5;

    this.animate();
  }
  animate() {
    requestAnimationFrame(() => {
      this.animate();
    });

    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    super.dispose()

    this.geometry.dispose()
    this.material.dispose()
    this.renderer.dispose()
  }
}
