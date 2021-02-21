/// <reference lib="dom" />
import type Tweakpane from "https://cdn.skypack.dev/-/tweakpane@v1.5.8-yOgAVh2ofTMUQxh0irQW/dist=es2020,mode=types/dist/types/index.d.ts";
import type { PerspectiveCamera, Mesh } from "../deps.ts";
import type { Cube } from "../objects/cube.ts";
import { Raycaster, Vector3, Vector2 } from "../deps.ts";

export class TopDownControls {
  // constants
  // PI_2 = Math.PI / 2;
  // twoPI = Math.PI * 2;

  // downAxis = new Vector3(0, -1, 0);

  body;
  movementMesh;
  camera;
  domElement;

  offset = new Vector3(3, 15);

  minDistance = 5;
  maxDistance = 40;
  distanceStepSize = 1;
  currentDistance = 16;
  // distanceTheshold = 5;

  rayCaster = new Raycaster()
  mouse = new Vector2()
  moveLocation = new Vector3()

  constructor(
    object: Cube,
    movementMesh: Mesh,
    camera: PerspectiveCamera,
    domElement: HTMLElement,
  ) {
    this.body = object.body;
    this.camera = camera;
    this.domElement = domElement;
    this.movementMesh = movementMesh;

    // initialize
    this.offset.setLength(this.currentDistance);

    this.domElement.addEventListener("pointerdown", async (e: PointerEvent) => {
      switch (e.button) {
        case 0:
          // left mouse button
          this.action();
          break;
        case 2:
          // left mouse button
          this.movePlayerToLocation();
          break;
        default:
          break;
      }
    });

    this.domElement.addEventListener("pointermove", async (e: PointerEvent) => {
      this.mouse.x = ( e.clientX / this.domElement.clientWidth ) * 2 - 1;
      this.mouse.y = - ( e.clientY / this.domElement.clientHeight ) * 2 + 1;
    });

    this.domElement.addEventListener("contextmenu", async (e: MouseEvent) => {
      e.preventDefault();
    });

    this.domElement.addEventListener("wheel", async (e) => {
      this.onWheel(e);
    });

    document.addEventListener("keydown", async (e) => {
      this.onKeyDown(e);
    });

    document.addEventListener("keyup", async (e) => {
      this.onKeyUp(e);
    });

  }

  initPane(pane: Tweakpane) {
    // Add variables to pane
    const f1 = pane.addFolder({ title: "PlayerControls", expanded: true });
    // f1.addInput(this.offset, "x");
    // f1.addInput(this.offset, "y");
    // f1.addInput(this.offset, "z");

    f1.addInput(this, "currentDistance");

    // f1.on("change", (value) => {
    //   // ?
    // })
  }

  action () {
    console.log("Left click - Action");
    // Might be some kind of action needing to be taken
  }

  movePlayerToLocation() {
    // move character around
    console.log("Right click - Move Player around");

    // cast the ray to find the location the user clicked
    this.rayCaster.setFromCamera( this.mouse, this.camera );

    // See if the ray from the camera into the world hits one of our meshes
    const intersects = this.rayCaster.intersectObject( this.movementMesh );

    // Toggle rotation bool for meshes that we clicked
    if ( intersects.length > 0 ) {

      // helper is just a mesh.
      console.log("intersection with mesh");
      this.moveLocation.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z)

      // could add an animation of mouse click at location
      // otherwise its onto pathing the player there
      
      

    }
  }

  onKeyDown(event: KeyboardEvent) {
    // future idea: let the player save/load there on keybindings config file
    switch (event.key) {
      case "a":
        break;
      case "d":
        break;
      case "w":
        break;
      case "s":
        break;
      case " ":
        break;
      case "q":
        console.log(`Pressed ${event.key}`);
        break;
      default:
        // console.log(`Didn't handle keydown for: ${event.key}`);
        break;
    }
  }

  onKeyUp(event: KeyboardEvent) {
    switch (event.key) {
      case "a":
        break;
      case "d":
        break;
      case "w":
        break;
      case "s":
        break;
      case " ":
        break;
      default:
        // console.log(`Didn't handle keydown for: ${event.key}`);
        break;
    }
  }

  onWheel(event: WheelEvent) {
    const wheelDelta = event.deltaY > 0
      ? this.distanceStepSize
      : -this.distanceStepSize;
    // restrict radius to be between desired limits
    if (
      this.currentDistance >= this.minDistance - wheelDelta &&
      this.currentDistance <= this.maxDistance - wheelDelta
    ) {
      this.currentDistance += wheelDelta;
    }

    this.offset.setLength(this.currentDistance);
  }

  update() {
    // player position may change
    // 1/3 - 2/3 camera move to
    // update camera position

    const objPosition = new Vector3().copy(this.body.position);

    objPosition.add(this.offset);

    this.camera.position.set(objPosition.x, objPosition.y, objPosition.z);
    this.camera.lookAt(
      this.body.position.x,
      this.body.position.y,
      this.body.position.z,
    );
  }
}
