/// <reference lib="dom" />
import {
  Scene,
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
} from "./deps.ts";
import { ObjectControls } from "./ObjectControls.ts";

// Next Steps:

// Look into shadows from the directional light

// create cannon-es module for deno
// start with this https://github.com/pmndrs/cannon-es/tree/master/src ...there's .ts there... omg.

const clock = new Clock(true)

const renderer = new WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new Scene();
scene.background = new Color(0xaaaaaa);

const directionalLight = new DirectionalLight();
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// const directionalLightHelper = new DirectionalLightHelper(directionalLight)
// scene.add(directionalLightHelper)

const hemisphereLight = new HemisphereLight(0xaaaaaa, 0xaaaaaa, 0.7);
scene.add(hemisphereLight);

const camera = new PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(10, 10, 10);
camera.lookAt(new Vector3(0, 0, 0));
scene.add(camera);

const plane = new PlaneBufferGeometry(100, 100, 1, 1);
plane.rotateX(-Math.PI / 2);
let material = new MeshStandardMaterial({ color: 0xaaaaaa });
const floor = new Mesh(plane, material);
floor.name = "floor";
floor.receiveShadow = true;
scene.add(floor);

const geometry = new BoxGeometry();
material = new MeshStandardMaterial({ color: 0x00ff00 });
const cube = new Mesh(geometry, material);
cube.position.setY(1);
cube.name = "cube";
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

const controls = new ObjectControls(camera, renderer.domElement);

const geo = new BufferGeometry();
const mat = new LineBasicMaterial({ color: 0xff00ff });
const prevRay = new Line(geo, mat);
scene.add(prevRay);

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta()

  controls.update(delta)

  renderer.render(scene, camera);
}

animate();

// UI & Events
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

//move green cube
const testButton = document.getElementById("test")!;
testButton.onclick = (e) => {
  const scalar = 50;
  const Xsign = Math.random() < 0.5 ? -1 : 1;
  const Zsign = Math.random() < 0.5 ? -1 : 1;
  cube.position.set(
    Xsign * Math.random() * scalar,
    1,
    Zsign * Math.random() * scalar,
  );
};

// add red cubes
const test2Button = document.getElementById("test2")!;
test2Button.onclick = (e) => {
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
};

// console log scene
const test3Button = document.getElementById("test3")!;
test3Button.onclick = (e) => {
  console.log(scene.children);
};

const canvasElement = document.querySelector("canvas");
const changeOrbitElement = document.querySelector(
  "input#changeOrbit",
) as HTMLInputElement;
const castRayElement = document.querySelector(
  "input#castRay",
) as HTMLInputElement;

canvasElement!.onclick = (e) => {
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
};

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

const slider = document.getElementById("myRange")! as HTMLInputElement;
slider.value = controls.acceleration.toString()

slider.addEventListener('change', () => {
  controls.acceleration = parseInt(slider.value)
  sliderNumber.innerText = `acceleration - ${slider.value}`
})

const sliderNumber = document.getElementById("myRangeNumber") as HTMLParagraphElement;
sliderNumber.innerText = `acceleration - ${controls.acceleration}`