/// <reference lib="dom" />
import {
  Euler,
} from "./deps.ts";
import type {
  Object3D,
} from "./deps.ts"

class ObjectControls {
  object: Object3D;
  domElement: HTMLElement;

  isLocked: boolean;

  euler: Euler;

	minPolarAngle = 0; // radians
  maxPolarAngle = Math.PI; // radians
  PI_2 = Math.PI / 2

  acceleration: number;

  forward: number;
  backward: number;
  left: number;
  right: number;
  jump: number;

  constructor(
    object: Object3D,
    domElement: HTMLElement,
  ) {
    this.object = object;
    this.domElement = domElement;

    this.isLocked = false;

    this.euler = new Euler(0, 0, 0, 'YXZ')

    this.acceleration = 30.0;

    this.forward = 0;
    this.backward = 0;
    this.left = 0;
    this.right = 0;
    this.jump = 0;

    this.domElement.addEventListener("mousedown", () => {
      if (!this.isLocked) {
        this.domElement.requestPointerLock();
      }
    });

    document.addEventListener("pointerlockchange", () => {
      if (document.pointerLockElement === this.domElement) {
        this.isLocked = true
      } else {
        this.isLocked = false
      }
    });

    this.domElement.addEventListener("mousemove", (event:MouseEvent) => {
      if (this.isLocked === false) {
        return
      };

      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      this.euler.setFromQuaternion(object.quaternion);

      // could adjust this later to make it more or less sensitive
      this.euler.y -= movementX * 0.002;
      this.euler.x -= movementY * 0.002;

      this.euler.x = Math.max(
        this.PI_2 - this.maxPolarAngle,
        Math.min(this.PI_2 - this.minPolarAngle, this.euler.x),
      );

      object.quaternion.setFromEuler(this.euler);

      // this.domElement.dispatchEvent(new Event("change"));
    });
    // this.domElement.addEventListener("mousedown", this.mousedown);
    // this.domElement.addEventListener("mouseup", this.mouseup);

    document.addEventListener("keydown", (event) => {
      if (this.isLocked) {
        switch (event.key) {
          case 'a':
            this.left = 1
            break;
          case 'd':
            this.right = 1
            break;
          case 'w':
            this.forward = 1
            break
          case 's':
            this.backward = 1
            break
          case ' ':
            this.jump = 1
            break
          default:
            console.log(`Didn't handle keydown for: ${event.key}`);
            break;
        }
      }
    });
    document.addEventListener("keyup", (event) => {
      if (this.isLocked) {
        switch (event.key) {
          case 'a':
            this.left = 0
            break;
          case 'd':
            this.right = 0
            break;
          case 'w':
            this.forward = 0
            break
          case 's':
            this.backward = 0
            break
          case ' ':
            this.jump = 0
            break
          default:
            // console.log(`Didn't handle keyup for: ${event.key}`);
            break;
        }
      }
    });
  }

  update(delta:number) {
    const speed = delta * this.acceleration
    // do some movement

    this.object.translateX( (-this.left + this.right) * speed )
    this.object.translateY( ( this.jump) * speed )
    this.object.translateZ( (-this.forward + this.backward) * speed )
  }
}

export { ObjectControls };
