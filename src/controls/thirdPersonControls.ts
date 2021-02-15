/// <reference lib="dom" />
import type Tweakpane from "https://cdn.skypack.dev/-/tweakpane@v1.5.8-yOgAVh2ofTMUQxh0irQW/dist=es2020,mode=types/dist/types/index.d.ts";
import type { PerspectiveCamera } from "../deps.ts";
import { Euler, Quaternion, Spherical, Vector3 } from "../deps.ts";

export class ThirdPersonControls {
  // constants
  PI_2 = Math.PI / 2;
  twoPI = Math.PI * 2;

  downAxis = new Vector3(0, -1, 0);

  body;
  camera;
  domElement;

  offset;

  cameraQuat;
  cameraQuatInv;

  spherical;
  sphericalDelta;

  minDistance;
  maxDistance;
  distanceStepSize;
  currentDistance;
  distanceTheshold;

  isLocked;
  isGrounded;
  move: {
    left: number;
    right: number;
    up: number;
    down: number;
    forward: number;
    backward: number;
  };
  canMove;
  acceleration;

  constructor(camera:PerspectiveCamera, domElement:HTMLElement) {
    this.body = object.body;
    this.camera = camera;
    this.domElement = domElement;

    this.offset = new Vector3();
    this.cameraQuat = new Quaternion().setFromUnitVectors(
      camera.up,
      new Vector3(0, 1, 0),
    );
    this.cameraQuatInv = this.cameraQuat.invert();
    this.spherical = new Spherical();
    this.sphericalDelta = new Spherical();

    this.minDistance = 0;
    this.maxDistance = 20;
    this.distanceStepSize = 1;
    this.currentDistance = 6;
    this.distanceTheshold = 5;

    this.isLocked = false;
    this.isGrounded = false;
    this.move = {
      left: 0,
      right: 0,
      up: 0,
      down: 0,
      forward: 0,
      backward: 0,
    };
    this.acceleration = 12;
    this.canMove = true;

    this.domElement.addEventListener("mousedown", async (e: MouseEvent) => {
      switch (e.button) {
        case 0:
          // left mouse button
          this.onMouseDown();
          break;
        default:
          break;
      }
    });

    this.domElement.addEventListener("contextmenu", async (e: MouseEvent) => {
      e.preventDefault();
    });

    document.addEventListener("pointerlockchange", async () => {
      this.onPointerLockChange();
    });

    document.addEventListener("mousemove", async (e) => {
      this.onMouseMove(e);
    });

    document.addEventListener("keydown", async (e) => {
      this.onKeyDown(e);
    });

    document.addEventListener("keyup", async (e) => {
      this.onKeyUp(e);
    });

    document.addEventListener("wheel", async (e) => {
      this.onWheel(e);
    });

    // intialize the camera properly
    this.isLocked = true;
    this.onMouseMove(
      new MouseEvent("mousemove", { movementX: 0, movementY: 0 }),
    );
    this.isLocked = false;
  }

  initPane(pane: Tweakpane) {
    // Add variables to pane
    const f1 = pane.addFolder({ title: "PlayerControls", expanded: true });
    f1.addInput(this.spherical, "phi");
    f1.addInput(this.sphericalDelta, "phi", { label: "delta phi" });
    f1.addSeparator();
    f1.addInput(this, "isLocked");
    f1.addInput(this, "canMove");
    f1.addInput(this, "isGrounded");
  }

  onMouseMove(event: MouseEvent) {
    if (this.isLocked === false) {
      return;
    }

    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;

    const objPosition = new Vector3().copy(this.body.position);

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

    // update the position
    this.update();
  }

  onMouseDown() {
    if (!this.isLocked) {
      this.domElement.requestPointerLock();
    }
  }

  onPointerLockChange() {
    // console.log("change");
    if (document.pointerLockElement === this.domElement) {
      this.isLocked = true;
    } else {
      this.isLocked = false;
    }
  }

  onKeyDown(event: KeyboardEvent) {
    // future idea: let the player save/load there on keybindings config file
    if (this.canMove) {
      switch (event.key) {
        case "a":
          this.move.left = 1;
          break;
        case "d":
          this.move.right = 1;
          break;
        case "w":
          this.move.forward = 1;
          break;
        case "s":
          this.move.backward = 1;
          break;
        case " ":
          if (this.isGrounded) {
            this.move.up = 1;
          }
          break;
        case "e":
          console.log(`Pressed e`);
          break;
        default:
          // console.log(`Didn't handle keydown for: ${event.key}`);
          break;
      }
    }
  }

  onKeyUp(event: KeyboardEvent) {
    switch (event.key) {
      case "a":
        this.move.left = 0;
        break;
      case "d":
        this.move.right = 0;
        break;
      case "w":
        this.move.forward = 0;
        break;
      case "s":
        this.move.backward = 0;
        break;
      case " ":
        this.move.up = 0;
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
    this.onMouseMove(
      new MouseEvent("mousemove", { movementX: 0, movementY: 0 }),
    );
  }

  getMovementDirection() {
    return new Vector3(
      -this.move.left + this.move.right,
      0,
      -this.move.forward + this.move.backward,
    ).normalize();
  }

  update() {
    // update obj velocity
    const velVec = this.getMovementDirection().applyQuaternion(
      this.body.quaternion,
    ).multiplyScalar(this.acceleration);
    this.body.velocity.set(velVec.x, this.body.velocity.y, velVec.z);

    if (this.move.up && this.isGrounded) {
      this.body.velocity.y = 10;
    }
    //  else if (this.isGrounded) {
    //   this.body.velocity.y = 0;
    // }

    // update camera position
    const objPosition = new Vector3().copy(this.body.position);
    this.camera.position.copy(objPosition).add(this.offset);

    this.camera.lookAt(objPosition);

    // cast a small ray to update whether the player is grounded or not
    // try {
    // add more raycasts for better  grounded condition
    // const vecLength = new Vec3(0, 1, 0)
    // const pos1 = this.body.position
    // const posA = pos1.vadd(vecLength).vadd()
    // const pos2 = this.body.position
    // const posB = pos2.vadd(vecLength)
    // const pos3 = this.body.position
    // const posC = pos3.vadd(vecLength)
    // const pos4 = this.body.position
    // const posD = pos4.vadd(vecLength)

    // world.raycastClosest(pos1, )
    //   const ray = new Raycaster(objPosition, this.downAxis, 0, 1.1)
    //     // check entire scene for the moment
    //     .intersectObjects([this.camera.parent], true);
    //   if (ray.length > 0) {
    //     if (this.canMove) {
    //       switch (ray[0].object.name) {
    //         case "floor":
    //           document.dispatchEvent(
    //             new CustomEvent("player", { detail: ray[0] }),
    //           );
    //           // this.canMove = false
    //           break;
    //         case "randomCube":
    //           document.dispatchEvent(
    //             new CustomEvent("player", { detail: ray[0] }),
    //           );
    //           break;
    //         default:
    //           break;
    //       }
    //     }
    //     this.isGrounded = true;
    //   } else {
    //     this.isGrounded = false;
    //   }
    // } catch (error) {
    // }

    // update obj rotation
    const camEuler = new Euler().setFromQuaternion(this.camera.quaternion);

    camEuler.reorder("YXZ");
    camEuler.x = 0;
    const camQuat = new Quaternion().setFromEuler(camEuler);

    this.body.quaternion.set(camQuat.x, camQuat.y, camQuat.z, camQuat.w);
  }
}
