/// <reference lib="dom" />
import {
  Euler,
  Camera,
  Vector3,
  Body,
  Vec3,
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
  axisAngle = new Vec3(0, 1, 0);

  enableDamping: boolean;
  dampingFactor: number;

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

    this.enableDamping = false;
    this.dampingFactor = 0.001;

    this.minDistance = 0;
    this.maxDistance = 30;
    this.distanceStepSize = 2;
    this.currentDistance = 10;
    this.distanceTheshold = 5;

    this.camera.lookAt(
      new Vector3(
        this.object.position.x,
        this.object.position.y,
        this.object.position.z,
      ),
    );

    this.isLocked = false;
    this.euler = new Euler(0, 0, 0, "YXZ");
    this.domElement = domElement;

    // this.domElement.tabIndex = 0;

    this.domElement.addEventListener("mousedown", () => {
      if (!this.isLocked) {
        this.domElement.requestPointerLock();
      }
    });

    document.addEventListener("pointerlockchange", () => {
      if (document.pointerLockElement === this.domElement) {
        this.isLocked = true;
      } else {
        this.isLocked = false;
      }
    });

    this.domElement.addEventListener("mousemove", (event: MouseEvent) => {
      if (this.isLocked === false) {
        return;
      }

      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      // how would one turn the movement vector into a quaternion?
      // using this.spherical co-ordinates?
      // left/right
      this.sphericalDelta.theta = this.twoPI * movementX /
        this.domElement.clientHeight;
      // up/down
      this.sphericalDelta.phi = this.twoPI * movementY /
        this.domElement.clientHeight;

      // this.euler.setFromQuaternion(this.camera.quaternion);

      // // could adjust this later to make it more or less sensitive
      // this.euler.y -= movementX * 0.002;
      // this.euler.x -= movementY * 0.002;

      // this.euler.x = Math.max(
      //   this.PI_2 - Math.PI,
      //   Math.min(this.PI_2, this.euler.x),
      // );

      // this.camera.quaternion.setFromEuler(this.euler);

      // then slerp the quaternion of the object that we're following to the quaternion of the camera

      // update the position
      this.update();
    });
    // this.domElement.addEventListener("mousedown", this.mousedown);
    // this.domElement.addEventListener("mouseup", this.mouseup);

    this.domElement.addEventListener("keydown", (event) => {
      if (this.isLocked) {
        // currently doesn't update according to player direction
        switch (event.key) {
          case "a":
            this.object.velocity.x = -1;
            break;
          case "d":
            this.object.velocity.x = -1;
            break;
          case "w":
            this.object.velocity.z = 1;
            break;
          case "s":
            this.object.velocity.z = -1;
            break;
          case " ":
            this.object.velocity.y = 10;
            break;
          default:
            // console.log(`Didn't handle keydown for: ${event.key}`);
            break;
        }
      }
    });
  }

  update() {
    const position = this.camera.position;
    const objPosition = new Vector3(
      this.object.position.x,
      this.object.position.y,
      this.object.position.z,
    );

    this.offset.copy(position).sub(objPosition);

    // rotate offset to "y-axis-is-up" space
    this.offset.applyQuaternion(this.cameraQuat);

    // angle from z-axis around y-axis
    this.spherical.setFromVector3(this.offset);

    if (this.enableDamping) {
      // this is where you could creating the boolean setting to invert the orbital controls
      this.spherical.theta -= this.sphericalDelta.theta * this.dampingFactor;
      this.spherical.phi -= this.sphericalDelta.phi * this.dampingFactor;
    } else {
      // this is where you could creating the boolean setting to invert the orbital controls
      this.spherical.theta -= this.sphericalDelta.theta;
      this.spherical.phi -= this.sphericalDelta.phi;
    }

    // restrict phi to be between desired limits
    this.spherical.phi = Math.max(0, Math.min(Math.PI, this.spherical.phi));

    this.spherical.makeSafe();

    // restrict radius to be between desired limits
    this.spherical.radius = Math.max(
      this.minDistance,
      Math.min(this.maxDistance, this.spherical.radius),
    );
    // set radius to player setting
    this.spherical.radius = this.currentDistance;

    this.offset.setFromSpherical(this.spherical);

    // rotate offset back to "camera-up-vector-is-up" space
    this.offset.applyQuaternion(this.cameraQuatInv);

    position.copy(objPosition).add(this.offset);

    this.camera.lookAt(objPosition);

    if (this.enableDamping === true) {
      this.sphericalDelta.theta *= (1 - this.dampingFactor);
      this.sphericalDelta.phi *= (1 - this.dampingFactor);
    } else {
      this.sphericalDelta.set(0, 0, 0);
    }
  }
}

export { PlayerControls };
