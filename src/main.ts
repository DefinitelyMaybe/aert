/// <reference lib="dom" />
import {
  Body,
  Clock,
  Color,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  NaiveBroadphase,
  PerspectiveCamera,
  Plane,
  PlaneBufferGeometry,
  Vec3,
  Vector2,
  WebGLRenderer,
  World,
} from "./deps.js";
import { PlayerControls } from "./PlayerControls.js";
import { spawnCubes } from "./helpers.js";
import { Scene } from "./scene.js";
import { Cube } from "./objects/cube.js";

// state
export const state = {
  running: false,
  displayRestart: false,
};

// time
export const clock = new Clock(true);

// physics
export const world = new World();
// @ts-ignore
world.gravity.set(0, -24, 0);
// @ts-ignore
world.broadphase = new NaiveBroadphase();

// renderer
export const renderer = new WebGLRenderer(
  { canvas: document.querySelector("canvas") as HTMLCanvasElement, logarithmicDepthBuffer: true },
);
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

// scene
export const scene = new Scene();
scene.background = new Color(0xdddddd);

// lighting
const directionalLight = new DirectionalLight();
const d = 100;
directionalLight.position.set(d, d, d);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize = new Vector2(2048, 2048);
directionalLight.shadow.camera.left = -d;
directionalLight.shadow.camera.right = d;
directionalLight.shadow.camera.top = d;
directionalLight.shadow.camera.bottom = -d;
scene.add(directionalLight);

// const directionalLightHelper = new DirectionalLightHelper(directionalLight);
// scene.add(directionalLightHelper);

const hemisphereLight = new HemisphereLight(0xaaaaaa, 0xaaaaaa, 0.7);
scene.add(hemisphereLight);

// camera
export const camera = new PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.01,
  1000,
);
camera.position.set(10, 10, 10);
scene.add(camera);

// flat world
const plane = new PlaneBufferGeometry(100, 100, 1, 1);
plane.rotateX(-Math.PI / 2);
let material = new MeshStandardMaterial({ color: 0xaa0000 });
const floor = new Mesh(plane, material);
floor.name = "floor";
floor.receiveShadow = true;
scene.add(floor);

const groundPlane = new Plane();
const groundBody = new Body({ mass: 0 });
groundBody.addShape(groundPlane, undefined, undefined);
// @ts-ignore
groundBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(groundBody);

// player
export const player = new Cube(
  { material: new MeshStandardMaterial({ color: 0x00ff00 }) },
);
player.castShadow = true;
player.receiveShadow = true;
player.name = "player";
// @ts-ignore
player.body.position.y = 10;
scene.add(player);

// controls
export const controls = new PlayerControls(
  player,
  camera,
  renderer.domElement,
);

// raycasting for fun
// const geo = new BufferGeometry();
// const mat = new LineBasicMaterial({ color: 0xff00ff });
// const prevRay = new Line(geo, mat);
// scene.add(prevRay);

window.addEventListener("visibilitychange", () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
  if (document.visibilityState === "hidden") {
    state.running = false;
    clock.stop();
  } else {
    // get ready to run again
    clock.start();
    state.running = true;
  }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

// game loop
function animate() {
  requestAnimationFrame(animate);

  if (state.running) {
    const delta = clock.getDelta();

    // make a physics step
    world.step(delta, undefined, undefined);

    // update rendered positions
    scene.traverse((object) => {
      if (object.isCube) {
        object.quaternion.x = object.body.quaternion.x;
        object.quaternion.y = object.body.quaternion.y;
        object.quaternion.z = object.body.quaternion.z;
        object.quaternion.w = object.body.quaternion.w;

        object.position.x = object.body.position.x;
        object.position.y = object.body.position.y;
        object.position.z = object.body.position.z;
        object.position.w = object.body.position.w;
      }
    });

    // camera position must be updated
    // velocity may move object position
    controls.update();

    // finally make the render to screen
    renderer.render(scene, camera);

    // updateTable();
  }
}

// finially start renderering
state.running = true;
spawnCubes();

animate();
// state.running = false
