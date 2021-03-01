import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "../deps.ts";

export class spinningCubeWorld {
  scene = new Scene();
  camera;
  renderer;
  cube: Mesh;

  constructor() {
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

    const geometry = new BoxGeometry();
    const material = new MeshBasicMaterial({ color: 0x00ff00 });

    this.cube = new Mesh(geometry, material);
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
}
