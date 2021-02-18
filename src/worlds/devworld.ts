import type { WorldInitOptions } from "./world.ts";
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
} from "../deps.ts";
import { Player } from "../objects/player.ts";
import { Scene } from "../scene.ts";
import { pane } from "../main.ts";
import { spawnCubes } from "../helpers.ts";
import { World } from "./world.ts";

export class DevWorld extends World {
  // state
  state = {
    running: false,
    displayRestart: false,
  };

  fogValues = {
    density: 0.03,
    color: 0xdddddd,
  };

  // time
  clock = new Clock();

  // renderer
  renderer

  // scene
  scene = new Scene();

  // physics
  physicsWorld;

  // camera
  camera

  // player
  player

  constructor () {
    super()

    this.physicsWorld = this.scene.physics
    this.physicsWorld.gravity.set(0, -24, 0);
    this.physicsWorld.broadphase = new NaiveBroadphase();

    this.renderer = new WebGLRenderer(
      { canvas: document.querySelector("canvas") as HTMLCanvasElement },
    );
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene.background = new Color(this.fogValues.color);
    this.scene.fog = new FogExp2(this.fogValues.color, this.fogValues.density);

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
    this.scene.add(directionalLight);

    // const directionalLightHelper = new DirectionalLightHelper(directionalLight);
    // scene.add(directionalLightHelper);

    const hemisphereLight = new HemisphereLight(0xaaaaaa, 0xaaaaaa, 0.7);
    this.scene.add(hemisphereLight);

    // camera
    this.camera = new PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.01,
      1000,
    );
    this.camera.position.set(10, 30, 10);
    this.scene.add(this.camera);

    // flat world
    const plane = new PlaneBufferGeometry(100, 100, 1, 1);
    plane.rotateX(-Math.PI / 2);
    let material = new MeshStandardMaterial({ color: 0xaa0000 });
    const floor = new Mesh(plane, material);
    floor.name = "floor";
    floor.receiveShadow = true;
    this.scene.add(floor);

    const groundPlane = new Plane();
    const groundBody = new Body({ mass: 0 });
    groundBody.addShape(groundPlane, undefined, undefined);
    groundBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
    this.physicsWorld.addBody(groundBody);

    // player
    this.player = new Player(this.camera, this.renderer.domElement);
    this.player.mesh.body.position.y = 20;
    this.scene.add(this.player.mesh);

    // ---------------- Events --------------------
    window.addEventListener("visibilitychange", () => {
      // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
      if (document.visibilityState === "hidden") {
        this.state.running = false;
        this.clock.stop();
      } else {
        // get ready to run again
        this.clock.start();
        this.state.running = true;
      }
    });

    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.onresize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // document.addEventListener('mousedown',  (e) => {
    //   console.log({event:e.target});
    // })

    window.addEventListener("load", () => {
      // console.log("loaded");
      const f1 = pane.addFolder({ title: "state" });
      f1.addInput(this.state, "running");
      f1.addInput(this.state, "displayRestart");
      f1.addSeparator();
      f1.addInput(this.fogValues, "density", {
        max: 0.1,
        min: 0.0025,
        step: 0.01,
      });
      f1.addSeparator();
      const tweakbtn1 = f1.addButton({ title: "log it" });
      tweakbtn1.on("click", () => {
        console.log({ player: this.player });
      });
      f1.on("change", () => {
        this.scene.fog.density = this.fogValues.density;
      });

      this.player.controls.initPane(pane);
    });

    // finially start renderering
    this.state.running = true;
    spawnCubes(this.scene);

    this.animate();
  }

  animate() {
    requestAnimationFrame(() => {
      this.animate()
    });

    if (this.state.running) {
      const delta = this.clock.getDelta();

      // make a physics step
      this.physicsWorld.step(delta, undefined, undefined);

      // update rendered positions
      this.scene.traverse((object) => {
        if (object.isCube) {
          object.quaternion.x = object.body.quaternion.x;
          object.quaternion.y = object.body.quaternion.y;
          object.quaternion.z = object.body.quaternion.z;
          object.quaternion.w = object.body.quaternion.w;

          object.position.x = object.body.position.x;
          object.position.y = object.body.position.y;
          object.position.z = object.body.position.z;
        }
      });

      // camera position must be updated
      // velocity may move object position
      this.player.controls.update();

      // finally make the render to screen
      this.renderer.render(this.scene, this.camera);

      // refresh the pane to update any values
      pane.refresh();
    }
  }
}