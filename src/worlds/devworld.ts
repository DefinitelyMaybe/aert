import {
  Body,
  Clock,
  Color,
  DirectionalLight,
  FogExp2,
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
} from "../deps.ts";
import { Player } from "../objects/player.ts";
import { Scene } from "../scene.ts";
import { pane } from "../main.ts";

let fogValues = {
  density: 0.03,
  color: 0xdddddd,
};

// state
export const state = {
  running: false,
  displayRestart: false,
};

// time
export const clock = new Clock(true);

// physics
export const world = new World();
world.gravity.set(0, -24, 0);
world.broadphase = new NaiveBroadphase();

// renderer
export const renderer = new WebGLRenderer(
  { canvas: document.querySelector("canvas") as HTMLCanvasElement },
);
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

// scene
export const scene = new Scene();
scene.background = new Color(fogValues.color);
scene.fog = new FogExp2(fogValues.color, fogValues.density);

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
camera.position.set(10, 30, 10);
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
groundBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(groundBody);

// player
export const player = new Player(camera, renderer.domElement);
player.mesh.body.position.y = 20;
scene.add(player.mesh);

window.addEventListener("load", () => {
  console.log("loaded");
  const f1 = pane.addFolder({ title: "state" });
  f1.addInput(state, "running");
  f1.addInput(state, "displayRestart");
  f1.addSeparator();
  f1.addInput(fogValues, "density", {
    max: 0.1,
    min: 0.0025,
    step: 0.01,
  });
  f1.addSeparator();
  const tweakbtn1 = f1.addButton({ title: "log it" });
  tweakbtn1.on("click", () => {
    console.log({ player: player });
  });
  f1.on("change", () => {
    scene.fog.density = fogValues.density;
  });

  player.controls.initPane(pane);
});
