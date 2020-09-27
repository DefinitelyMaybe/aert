/// <reference lib="dom" />
import {
  Euler,
  Camera,
  Vector3,
  Body,
  Quaternion,
  Spherical,
} from "./deps.ts";

class PlayerControls {
  // values
  PI_2 = Math.PI / 2;
  twoPI = Math.PI * 2;

  // variables
  isLocked: boolean;
  euler: Euler;

  domElement: HTMLElement;
  object: Body;
  camera: Camera;

  offset: Vector3;
  cameraQuat: Quaternion;
  cameraQuatInv: Quaternion;
  spherical: Spherical;
  sphericalDelta: Spherical;

  minDistance: number;
  maxDistance: number;
  currentDistance: number;
  distanceTheshold: number;
  distanceStepSize: number;

  constructor(object: Body, camera: Camera, domElement: HTMLElement) {
    this.object = object;
    this.camera = camera;

    this.offset = new Vector3();
    this.cameraQuat = new Quaternion().setFromUnitVectors(
      camera.up,
      new Vector3(0, 1, 0),
    );
    this.cameraQuatInv = this.cameraQuat.inverse();
    this.spherical = new Spherical();
    this.sphericalDelta = new Spherical();

    this.minDistance = 0;
    this.maxDistance = 20;
    this.distanceStepSize = 1;
    this.currentDistance = 6;
    this.distanceTheshold = 5;

    this.isLocked = false;
    this.euler = new Euler(0, 0, 0, "YXZ");
    this.domElement = domElement;

    this.domElement.addEventListener("mousedown", async () => {
      this.onMouseDown()
    });

    document.addEventListener("pointerlockchange", async () => {
      this.onPointerLockChange()
    });

    this.domElement.addEventListener("mousemove", async (e: MouseEvent) => {
      this.onMouseMove(e);
    });
    // this.domElement.addEventListener("mousedown", this.mousedown);
    // this.domElement.addEventListener("mouseup", this.mouseup);

    document.addEventListener("keydown", async (e) => {
      this.onKeyDown(e)
    });

    this.domElement.addEventListener("wheel", async (e) => {
      this.onWheel(e)
    });

    // intialize the camera properly
    this.isLocked = true;
    this.onMouseMove(
      new MouseEvent("mousemove", { movementX: 0, movementY: 0 }),
    );
    this.isLocked = false;
  }

  onMouseMove(event: MouseEvent) {
    if (this.isLocked === false) {
      return;
    }

    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;

    const objPosition = new Vector3(
      this.object.position.x,
      this.object.position.y,
      this.object.position.z,
    );

    // left/right
    this.sphericalDelta.theta = this.twoPI * movementX /
      this.domElement.clientHeight;
    // up/down
    this.sphericalDelta.phi = this.twoPI * movementY /
      this.domElement.clientHeight;

    this.offset.copy(this.camera.position).sub(objPosition);

    // rotate offset to "y-axis-is-up" space
    this.offset.applyQuaternion(this.cameraQuat);

    // angle from z-axis around y-axis
    this.spherical.setFromVector3(this.offset);

    // this is where you could creating the boolean setting to invert the orbital controls
    this.spherical.theta -= this.sphericalDelta.theta;
    this.spherical.phi -= this.sphericalDelta.phi;

    // restrict phi to be between desired limits
    this.spherical.phi = Math.max(0, Math.min(Math.PI, this.spherical.phi));

    this.spherical.makeSafe();

    // set radius to player setting
    this.spherical.radius = this.currentDistance;

    this.offset.setFromSpherical(this.spherical);

    // rotate offset back to "camera-up-vector-is-up" space
    this.offset.applyQuaternion(this.cameraQuatInv);

    // TODO-DefinitelyMaybe: update the object towards
    // this.object.quaternion.slerp()

    // update the position
    this.update();
  }

  onMouseDown() {
    if (!this.isLocked) {
      this.domElement.requestPointerLock();
    }
  }

  onPointerLockChange() {
    if (document.pointerLockElement === this.domElement) {
      this.isLocked = true;
    } else {
      this.isLocked = false;
    }
  }

  onKeyDown(event:KeyboardEvent) {
    if (this.isLocked) {
      // TODO-DefinitelyMaybe: once the camera and object rotations are in sync,
      // make sure that the velocity
      switch (event.key) {
        case "a":
          this.object.velocity.x = -10;
          break;
        case "d":
          this.object.velocity.x = 10;
          break;
        case "w":
          this.object.velocity.z = 10;
          break;
        case "s":
          this.object.velocity.z = -10;
          break;
        case " ":
          this.object.velocity.y = 10;
          break;
        default:
          // console.log(`Didn't handle keydown for: ${event.key}`);
          break;
      }
    }
  }

  onWheel(event:WheelEvent) {
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
    this.onMouseMove(new MouseEvent("mousemove", {movementX:0,movementY:0}))
  }

  update() {
    const objPosition = new Vector3(
      this.object.position.x,
      this.object.position.y,
      this.object.position.z,
    );
    this.camera.position.copy(objPosition).add(this.offset);

    this.camera.lookAt(objPosition);
  }
}

export { PlayerControls };
