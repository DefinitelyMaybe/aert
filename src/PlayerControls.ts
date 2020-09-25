/// <reference lib="dom" />
import { Euler, Camera, Vector3, Body, Vec3, Quaternion } from "./deps.ts";

class PlayerControls {
  // values
  PI_2 = Math.PI / 2;

  // variables
  isLocked: boolean;
  euler: Euler;

  domElement: HTMLElement
  object: Body
  camera: Camera

  offsetVector: Vector3
  offsetQuat: Quaternion
  offsetQuatInv: Quaternion
  axisAngle = new Vec3(0, 1, 0);

  constructor(object:Body, camera:Camera, domElement:HTMLElement) {
    this.object = object
    this.camera = camera

    this.offsetVector = new Vector3(-1,1,-1)
    this.offsetQuat = new Quaternion(object.quaternion.x, object.quaternion.y, object.quaternion.z, object.quaternion.w)
    this.offsetQuatInv = this.offsetQuat.inverse()

    this.camera.lookAt(new Vector3(this.object.position.x, this.object.position.y, this.object.position.z))

    this.isLocked = false;
    this.euler = new Euler(0, 0, 0, "YXZ");
    this.domElement = domElement

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
      // using spherical co-ordinates?
      // 
      this.euler.setFromQuaternion(this.camera.quaternion);

      // could adjust this later to make it more or less sensitive
      this.euler.y -= movementX * 0.002;
      this.euler.x -= movementY * 0.002;

      this.euler.x = Math.max(
        this.PI_2 - Math.PI,
        Math.min(this.PI_2, this.euler.x),
      );

      this.camera.quaternion.setFromEuler(this.euler);
      // then set the quaternion of the object that we're following
      this.object.quaternion.setFromAxisAngle(this.axisAngle, this.euler.y)

      // this.domElement.dispatchEvent(new Event("change"));
    });
    // this.domElement.addEventListener("mousedown", this.mousedown);
    // this.domElement.addEventListener("mouseup", this.mouseup);

    document.addEventListener("keydown", (event) => {
      if (this.isLocked) {
        console.log("down");
        switch (event.key) {
          case "a":
            this.object.velocity.x = 1;
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
            console.log("jump");
            this.object.velocity.y = 10;
            break;
          default:
            // console.log(`Didn't handle keydown for: ${event.key}`);
            break;
        }
      }
    });
  }

  update(delta: number) {
    // set camera position to objects position + some vector
    
    // Vector X
    // copy camera position
    // subtract object position

    // rotate to y-axis is up
    // VectorX.applyQuaternion(this.offsetQuat)

    // use spherical co-ordinates
    // set from Vector X
    // adjust phi and theta



    // const newPos = new Vector3(this.object.position.x + this.offsetVector.x, this.object.position.y + this.offsetVector.y, this.object.position.z + this.offsetVector.z)
    const cubePos = new Vector3(this.object.position.x, this.object.position.y, this.object.position.z)
    // const newVec = new Vector3().copy(this.camera.position).sub(cubePos)
    // newVec.applyEuler(this.euler)
    this.camera.position.copy(cubePos).add(this.offsetVector)
    
    // possibly interpolate to position by using delta
  }
}

export { PlayerControls }