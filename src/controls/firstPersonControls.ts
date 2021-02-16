import type { PerspectiveCamera } from "../deps.ts";
import { Euler, Vector3 } from "../deps.ts";

export class PointerLockControls extends EventTarget {
  //constants
  PI_2 = Math.PI / 2;

  //constructed
  camera;
  domElement;

  // variables
  isLocked = false;

  // Set to constrain the pitch of the camera
  // Range is 0 to Math.PI radians
  minPolarAngle = 0; // radians
  maxPolarAngle = Math.PI; // radians

  changeEvent = new Event("change");
  lockEvent = new Event("lock");
  unlockEvent = new Event("unlock");

  euler = new Euler(0, 0, 0, "YXZ");

  vec = new Vector3();

  constructor(camera: PerspectiveCamera, domElement: HTMLElement) {
    super();
    if (domElement === undefined) {
      console.warn(
        'THREE.PointerLockControls: The second parameter "domElement" is now mandatory.',
      );
      domElement = document.body;
    }

    this.domElement = domElement;
    this.camera = camera;

    this.connect();
  }

  onMouseMove(event: MouseEvent) {
    if (this.isLocked === false) return;

    var movementX = event.movementX || 0;
    var movementY = event.movementY || 0;

    this.euler.setFromQuaternion(this.camera.quaternion);

    this.euler.y -= movementX * 0.002;
    this.euler.x -= movementY * 0.002;

    this.euler.x = Math.max(
      this.PI_2 - this.maxPolarAngle,
      Math.min(this.PI_2 - this.minPolarAngle, this.euler.x),
    );

    this.camera.quaternion.setFromEuler(this.euler);

    this.dispatchEvent(this.changeEvent);
  }

  onPointerlockChange() {
    if (
      this.domElement.ownerDocument.pointerLockElement === this.domElement
    ) {
      this.dispatchEvent(this.lockEvent);

      this.isLocked = true;
    } else {
      this.dispatchEvent(this.unlockEvent);

      this.isLocked = false;
    }
  }

  onPointerlockError() {
    console.error("THREE.PointerLockControls: Unable to use Pointer Lock API");
  }

  connect() {
    this.domElement.ownerDocument.addEventListener(
      "mousemove",
      this.onMouseMove,
      false,
    );
    this.domElement.ownerDocument.addEventListener(
      "pointerlockchange",
      this.onPointerlockChange,
      false,
    );
    this.domElement.ownerDocument.addEventListener(
      "pointerlockerror",
      this.onPointerlockError,
      false,
    );
  }

  disconnect() {
    this.domElement.ownerDocument.removeEventListener(
      "mousemove",
      this.onMouseMove,
      false,
    );
    this.domElement.ownerDocument.removeEventListener(
      "pointerlockchange",
      this.onPointerlockChange,
      false,
    );
    this.domElement.ownerDocument.removeEventListener(
      "pointerlockerror",
      this.onPointerlockError,
      false,
    );
  }

  dispose() {
    this.disconnect();
  }

  getDirection(v: Vector3) {
    let direction = new Vector3(0, 0, -1);
    return v.copy(direction).applyQuaternion(this.camera.quaternion);
  }

  moveForward(distance: number) {
    // move forward parallel to the xz-plane
    // assumes camera.up is y-up

    this.vec.setFromMatrixColumn(this.camera.matrix, 0);

    this.vec.crossVectors(this.camera.up, this.vec);

    this.camera.position.addScaledVector(this.vec, distance);
  }

  moveRight(distance: number) {
    this.vec.setFromMatrixColumn(this.camera.matrix, 0);

    this.camera.position.addScaledVector(this.vec, distance);
  }

  lock() {
    this.domElement.requestPointerLock();
  }

  unlock() {
    this.domElement.ownerDocument.exitPointerLock();
  }
}
