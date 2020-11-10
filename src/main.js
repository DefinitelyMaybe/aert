import {
  Body,
  Box,
  BoxGeometry,
  BufferGeometry,
  Clock,
  Color,
  DirectionalLight,
  HemisphereLight,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  NaiveBroadphase,
  PerspectiveCamera,
  Plane,
  PlaneBufferGeometry,
  Quaternion,
  Scene,
  Vec3,
  Vector2,
  Vector3,
  WebGLRenderer,
  World,
} from "./deps.js";
import { PlayerControls } from "./PlayerControls.js";
import { updateTable, updateValueTrackers } from "./ui.js"
import { spawnRedCubes } from "./helpers.js"

export const state = {
  running: false
}

export const clock = new Clock(true);

// Initialize Cannon.js
export const world = new World();
world.gravity.set(0, -24, 0);
world.broadphase = new NaiveBroadphase();

// Initialize Three.js
export const renderer = new WebGLRenderer({canvas:document.querySelector("canvas")});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

export const scene = new Scene();
scene.background = new Color(0xaaaaaa);

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

const camera = new PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.01,
  1000,
);
camera.position.set(10, 10, 10);
scene.add(camera);

// three.js plane
const plane = new PlaneBufferGeometry(100, 100, 1, 1);
plane.rotateX(-Math.PI / 2);
let material = new MeshStandardMaterial({ color: 0xaaaaaa });
const floor = new Mesh(plane, material);
floor.name = "floor";
floor.receiveShadow = true;
scene.add(floor);
// cannon.js plane
const groundPlane = new Plane();
const groundBody = new Body({ mass: 0 });
groundBody.addShape(groundPlane);
// groundBody.position.y -= 1;
groundBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
// groundBody.material = new Material({friction:0.0, })
world.addBody(groundBody);

// three.js cube
const geometry = new BoxGeometry(2, 2, 2);
material = new MeshStandardMaterial({ color: 0x00ff00 });
const box = new Mesh(geometry, material);
box.castShadow = true;
box.receiveShadow = true;
box.name = "player"
scene.add(box);
// cannon.js cube
const cube = new Box(new Vec3(1, 1, 1));
const cubeBody = new Body({ mass: 10 });
cubeBody.position.set(0, 10, 0);
cubeBody.addShape(cube);
// cubeBody.angularDamping = 1.0;
world.addBody(cubeBody);

export const controls = new PlayerControls(cubeBody, camera, renderer.domElement);

const geo = new BufferGeometry();
const mat = new LineBasicMaterial({ color: 0xff00ff });
const prevRay = new Line(geo, mat);
scene.add(prevRay);

const redCubesArray = [];

// functions
function animate() {
  requestAnimationFrame(animate);

  if (state.running) {
    const delta = clock.getDelta();

    updateValueTrackers(delta);

    // make a physics step
    world.step(delta);

    // update rendered positions
    box.position.copy(
      new Vector3(
        cubeBody.position.x,
        cubeBody.position.y,
        cubeBody.position.z,
      ),
    );
    box.quaternion.copy(
      new Quaternion(
        cubeBody.quaternion.x,
        cubeBody.quaternion.y,
        cubeBody.quaternion.z,
        cubeBody.quaternion.w,
      ),
    );

    redCubesArray.forEach((cube) => {
      const cPos = cube.userData.physics.body.position;
      cube.position.copy(new Vector3(cPos.x, cPos.y, cPos.z));
      const cQuat = cube.userData.physics.body.quaternion;
      cube.quaternion.copy(new Quaternion(cQuat.x, cQuat.y, cQuat.z, cQuat.w));
    });

    // camera position must be updated
    // velocity may move object position
    controls.update();

    renderer.render(scene, camera);

    updateTable();
  }
}

// finially start renderering
// state.running = true
animate();
spawnRedCubes();
