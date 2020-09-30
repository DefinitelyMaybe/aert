/// <reference lib="dom" />
import {
  Scene,
  DirectionalLightHelper,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshStandardMaterial,
  Mesh,
  DirectionalLight,
  Vector3,
  PlaneBufferGeometry,
  Raycaster,
  Vector2,
  Line,
  BufferGeometry,
  LineBasicMaterial,
  Color,
  HemisphereLight,
  Clock,
  World,
  Box,
  NaiveBroadphase,
  Plane,
  Body,
  Vec3,
  Quaternion,
} from "./deps.ts";
import { PlayerControls } from "./PlayerControls.ts";

const clock = new Clock(true);

// Initialize Cannon.js
const world = new World();
world.gravity.set(0, -10, 0);
world.broadphase = new NaiveBroadphase();

const renderer = new WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new Scene();
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
groundBody.position.y -= 0.5;
groundBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
// groundBody.material = new Material({friction:0.0, })
world.addBody(groundBody);

// three.js cube
const geometry = new BoxGeometry(1, 1, 1);
material = new MeshStandardMaterial({ color: 0x00ff00 });
const box = new Mesh(geometry, material);
box.castShadow = true;
box.receiveShadow = true;
scene.add(box);
// cannon.js cube
const cube = new Box(new Vec3(1, 1, 1));
const cubeBody = new Body({ mass: 1 });
cubeBody.position.set(0, 10, 0);
cubeBody.addShape(cube);
cubeBody.angularDamping = 1.0;
world.addBody(cubeBody);

const controls = new PlayerControls(cubeBody, camera, renderer.domElement);

const geo = new BufferGeometry();
const mat = new LineBasicMaterial({ color: 0xff00ff });
const prevRay = new Line(geo, mat);
scene.add(prevRay);

// functions
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  // simulate physics
  world.step(delta);

  // update rendered positions
  box.position.copy(
    new Vector3(cubeBody.position.x, cubeBody.position.y, cubeBody.position.z),
  );
  box.quaternion.copy(
    new Quaternion(
      cubeBody.quaternion.x,
      cubeBody.quaternion.y,
      cubeBody.quaternion.z,
      cubeBody.quaternion.w,
    ),
  );

  // camera position must be updated
  // velocity may move object position
  controls.update();

  renderer.render(scene, camera);

  updateUI();
}

function spawnRedCubes() {
  // respawn a red square somewhere within the current floor
  material = new MeshStandardMaterial({ color: 0xff0000 });
  for (let i = 0; i < 100; i++) {
    const cube = new Mesh(geometry, material);
    const scalar = 50;
    const Xsign = Math.random() < 0.5 ? -1 : 1;
    const Zsign = Math.random() < 0.5 ? -1 : 1;
    cube.position.set(
      Xsign * Math.random() * scalar,
      1,
      Zsign * Math.random() * scalar,
    );
    cube.name = "randomRedCube";
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
  }
}

function moveGreenCube() {
  const scalar = 50;
  const Xsign = Math.random() < 0.5 ? -1 : 1;
  const Zsign = Math.random() < 0.5 ? -1 : 1;
  cubeBody.position.set(
    Xsign * Math.random() * scalar,
    30,
    Zsign * Math.random() * scalar,
  );
}

function castRay(e: MouseEvent) {
  if (castRayElement.checked) {
    console.log("casting ray");
    // throw out a ray and find a random object
    const rayCaster = new Raycaster();
    rayCaster.setFromCamera(
      new Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      ),
      camera,
    );
    const intersection = rayCaster.intersectObject(scene, true);

    // draw the line that was raycasted
    const direction = rayCaster.ray.direction.multiplyScalar(50);
    const p0 = rayCaster.ray.origin;
    const p1 = new Vector3(p0.x, p0.y, p0.z).add(direction);
    const p2 = new Vector3(p1.x, p1.y, p1.z).add(direction);

    const points = [];
    points.push(p0);
    points.push(p1);
    points.push(p2);
    prevRay.geometry.setFromPoints(points);

    //check intersection
    if (intersection.length > 0) {
      const obj = intersection[0].object;
      console.log(`intersected with ${intersection.length} objects`);

      if (changeOrbitElement.checked) {
        console.log(`controls changed to ${obj.name}`);
        // controls.target = obj.position;
      }
    }
  }
}

// UI & Events

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

//table
const velx = document.getElementById("velx");
const vely = document.getElementById("vely");
const velz = document.getElementById("velz");

const angvelx = document.getElementById("angvelx");
const angvely = document.getElementById("angvely");
const angvelz = document.getElementById("angvelz");

function updateUI() {
  const x = `${Math.round(cubeBody.velocity.x * 1) / 1}`;
  const y = `${Math.round(cubeBody.velocity.y * 1) / 1}`;
  const z = `${Math.round(cubeBody.velocity.z * 1) / 1}`;

  velx!.innerText = x;
  vely!.innerText = y;
  velz!.innerText = z;

  const angx = `${Math.round(cubeBody.angularVelocity.x * 1) / 1}`;
  const angy = `${Math.round(cubeBody.angularVelocity.y * 1) / 1}`;
  const angz = `${Math.round(cubeBody.angularVelocity.z * 1) / 1}`;

  angvelx!.innerText = angx;
  angvely!.innerText = angy;
  angvelz!.innerText = angz;
}
//test button 1
const testButton = document.getElementById("test1")!;
testButton.innerText = "spawn red cubes";
testButton.onclick = (e) => {
  spawnRedCubes();
};

// // add red cubes
const test2Button = document.getElementById("test2")!;
test2Button.innerText = "log position";
test2Button.onclick = () => {
  const x = `${Math.round(cubeBody.position.x * 1) / 1}`;
  const y = `${Math.round(cubeBody.position.y * 1) / 1}`;
  const z = `${Math.round(cubeBody.position.z * 1) / 1}`;
  console.log(`${x}, ${y}, ${z}`);
};

const test3Button = document.getElementById("test3")!;
test3Button.innerText = "move green cube";
test3Button.onclick = (e) => {
  moveGreenCube();
};

const canvasElement = document.querySelector("canvas");
const changeOrbitElement = document.querySelector(
  "input#changeOrbit",
) as HTMLInputElement;
const castRayElement = document.querySelector(
  "input#castRay",
) as HTMLInputElement;

canvasElement!.onclick = (e: MouseEvent) => {
  castRay(e);
};

const slider = document.getElementById("myRange")! as HTMLInputElement;
slider.value = controls.currentDistance.toString();

slider.addEventListener("change", () => {
  controls.currentDistance = parseInt(slider.value);
  sliderNumber.innerText = `distance - ${slider.value}`;
});

const sliderNumber = document.getElementById(
  "myRangeNumber",
) as HTMLParagraphElement;
sliderNumber.innerText = `distance - ${controls.currentDistance}`;

// finially start renderering
animate();
spawnRedCubes();
