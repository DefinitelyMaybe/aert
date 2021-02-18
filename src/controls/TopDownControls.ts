/// <reference lib="dom" />
import type Tweakpane from "https://cdn.skypack.dev/-/tweakpane@v1.5.8-yOgAVh2ofTMUQxh0irQW/dist=es2020,mode=types/dist/types/index.d.ts";
import type { PerspectiveCamera } from "../deps.ts";
import type { Cube } from "../objects/cube.ts";
import { Vector3 } from "../deps.ts";

export class TopDownControls {
  // constants
  PI_2 = Math.PI / 2;
  twoPI = Math.PI * 2;

  downAxis = new Vector3(0, -1, 0);

  body;
  camera;
  domElement;

  offset = new Vector3(3, 15);

  minDistance = 5;
  maxDistance = 40;
  distanceStepSize = 1;
  currentDistance = 16;
  distanceTheshold = 5;

  constructor(
    object: Cube,
    camera: PerspectiveCamera,
    domElement: HTMLElement,
  ) {
    this.body = object.body;
    this.camera = camera;
    this.domElement = domElement;

    // initialize
    this.offset.setLength(this.currentDistance);

    this.domElement.addEventListener("pointerdown", async (e: PointerEvent) => {
      // console.log("pointer event");
      // console.log({event:e.button});
      switch (e.button) {
        case 0:
          // left mouse button
          this.onPointerDown();
          break;
        default:
          break;
      }
    });

    this.domElement.addEventListener("contextmenu", async (e: MouseEvent) => {
      e.preventDefault();
    });

    this.domElement.addEventListener("wheel", async (e) => {
      this.onWheel(e);
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

  onPointerDown() {
    // move character around
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
