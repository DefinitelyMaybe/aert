import {
  EventDispatcher,
  Quaternion,
  Vector3,
  Object3D,
} from "deps.ts";

interface ObjectControlsOptions {
  // pointer lock
  // fixed axis rotation
}

class ObjectControls extends EventDispatcher {
  object;
  domElement;
  movementSpeed;
  movementSpeedMultiplier: number;
  // rollSpeed;
  // dragToLook;
  // autoForward;

  tmpQuaternion;
  mouseStatus;
  moveState: {
    up: number;
    down: number;
    left: number;
    right: number;
    forward: number;
    back: number;
    pitchUp: number;
    pitchDown: number;
    yawLeft: number;
    yawRight: number;
    rollLeft: number;
    rollRight: number;
  };
  moveVector;
  rotationVector;

  constructor(
    object: Object3D,
    domElement: HTMLElement,
    options: ObjectControlsOptions,
  ) {
    super();
    if (domElement === undefined) {
      console.warn(
        'THREE.FlyControls: The second parameter "domElement" is now mandatory.',
      );
      // @ts-ignore
      domElement = document;
    }

    this.object = object;
    this.domElement = domElement;

    if (domElement) this.domElement.setAttribute("tabindex", "-1");

    // API

    this.movementSpeed = 1.0;
    this.movementSpeedMultiplier = 1.0;
    // this.rollSpeed = 0.005;

    // this.dragToLook = false;
    // this.autoForward = false;

    this.tmpQuaternion = new Quaternion();

    this.mouseStatus = 0;

    this.moveState = {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
      forward: 0,
      back: 0,
      pitchUp: 0,
      pitchDown: 0,
      yawLeft: 0,
      yawRight: 0,
      rollLeft: 0,
      rollRight: 0,
    };
    this.moveVector = new Vector3(0, 0, 0);
    this.rotationVector = new Vector3(0, 0, 0);

    this.domElement.addEventListener("contextmenu", this.contextmenu, false);

    this.domElement.addEventListener("mousemove", this.mousemove, false);
    this.domElement.addEventListener("mousedown", this.mousedown, false);
    this.domElement.addEventListener("mouseup", this.mouseup, false);

    window.addEventListener("keydown", this.keydown, false);
    window.addEventListener("keyup", this.keyup, false);

    this.updateMovementVector();
    this.updateRotationVector();
  }

  keydown(event: KeyboardEvent) {
    if (event.altKey) {
      return;
    }

    //event.preventDefault();

    switch (event.code) {
      case "shift":
        this.movementSpeedMultiplier = .1;
        break;
      case "w":
        this.moveState.forward = 1;
        break;
      case "s":
        this.moveState.back = 1;
        break;

      case "a":
        this.moveState.left = 1;
        break;
      case "d":
        this.moveState.right = 1;
        break;
      case "r":
        this.moveState.up = 1;
        break;
      case "f":
        this.moveState.down = 1;
        break;
      case "up":
        this.moveState.pitchUp = 1;
        break;
      case "down":
        this.moveState.pitchDown = 1;
        break;
      case "left":
        this.moveState.yawLeft = 1;
        break;
      case "right":
        this.moveState.yawRight = 1;
        break;
      case "q":
        this.moveState.rollLeft = 1;
        break;
      case "e":
        this.moveState.rollRight = 1;
        break;
    }

    this.updateMovementVector();
    this.updateRotationVector();
  }

  keyup(event: KeyboardEvent) {
    switch (event.key) {
      case "shift":
        this.movementSpeedMultiplier = 1;
        break;
      case "w":
        this.moveState.forward = 0;
        break;
      case "s":
        this.moveState.back = 0;
        break;
      case "a":
        this.moveState.left = 0;
        break;
      case "d":
        this.moveState.right = 0;
        break;
      case "r":
        this.moveState.up = 0;
        break;
      case "f":
        this.moveState.down = 0;
        break;
      case "up":
        this.moveState.pitchUp = 0;
        break;
      case "down":
        this.moveState.pitchDown = 0;
        break;
      case "left":
        this.moveState.yawLeft = 0;
        break;
      case "right":
        this.moveState.yawRight = 0;
        break;
      case "q":
        this.moveState.rollLeft = 0;
        break;
      case "e":
        this.moveState.rollRight = 0;
        break;
    }

    this.updateMovementVector();
    this.updateRotationVector();
  }

  mousedown(event: MouseEvent) {
    this.domElement.focus();

    event.preventDefault();
    event.stopPropagation();

    if (false /*this.dragToLook*/) {
      // this.mouseStatus++;
    } else {
      switch (event.button) {
        case 0:
          this.moveState.forward = 1;
          break;
        case 2:
          this.moveState.back = 1;
          break;
      }

      this.updateMovementVector();
    }
  }

  mousemove(event: MouseEvent) {
    // if (!this.dragToLook || this.mouseStatus > 0) {
    //   var container = this.getContainerDimensions();
    //   var halfWidth = container.size[0] / 2;
    //   var halfHeight = container.size[1] / 2;

    //   this.moveState.yawLeft =
    //     -((event.pageX - container.offset[0]) - halfWidth) / halfWidth;
    //   this.moveState.pitchDown =
    //     ((event.pageY - container.offset[1]) - halfHeight) / halfHeight;

    //   this.updateRotationVector();
    // }
  }

  mouseup(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (false /*this.dragToLook*/) {
      // this.mouseStatus--;

      // this.moveState.yawLeft = this.moveState.pitchDown = 0;
    } else {
      switch (event.button) {
        case 0:
          this.moveState.forward = 0;
          break;
        case 2:
          this.moveState.back = 0;
          break;
      }

      this.updateMovementVector();
    }

    this.updateRotationVector();
  }

  update() {
    var lastQuaternion = new Quaternion();
    var lastPosition = new Vector3();
    const scope = this;

    return function (delta: number) {
      var moveMult = delta * scope.movementSpeed;
      // var rotMult = delta * scope.rollSpeed;

      scope.object.translateX(scope.moveVector.x * moveMult);
      scope.object.translateY(scope.moveVector.y * moveMult);
      scope.object.translateZ(scope.moveVector.z * moveMult);

      // scope.tmpQuaternion.set(
      //   scope.rotationVector.x * rotMult,
      //   scope.rotationVector.y * rotMult,
      //   scope.rotationVector.z * rotMult,
      //   1,
      // ).normalize();
      // scope.object.quaternion.multiply(scope.tmpQuaternion);

      if (
        lastPosition.distanceToSquared(scope.object.position) >
          Number.EPSILON ||
        8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > Number.EPSILON
      ) {
        scope.dispatchEvent(new Event("change"));
        lastQuaternion.copy(scope.object.quaternion);
        lastPosition.copy(scope.object.position);
      }
    };
  }

  updateMovementVector() {
    var forward =
      (this.moveState.forward /*|| (this.autoForward && !this.moveState.back)*/)
        ? 1
        : 0;

    this.moveVector.x = (-this.moveState.left + this.moveState.right);
    this.moveVector.y = (-this.moveState.down + this.moveState.up);
    this.moveVector.z = (-forward + this.moveState.back);

    //console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );
  }

  updateRotationVector() {
    this.rotationVector.x =
      (-this.moveState.pitchDown + this.moveState.pitchUp);
    this.rotationVector.y = (-this.moveState.yawRight + this.moveState.yawLeft);
    this.rotationVector.z =
      (-this.moveState.rollRight + this.moveState.rollLeft);

    //console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );
  }

  getContainerDimensions() {
    return {
      size: [this.domElement.offsetWidth, this.domElement.offsetHeight],
      offset: [this.domElement.offsetLeft, this.domElement.offsetTop],
    };
  }

  contextmenu(event: Event) {
    event.preventDefault();
  }

  dispose() {
    this.domElement.removeEventListener("contextmenu", this.contextmenu, false);
    this.domElement.removeEventListener("mousedown", this.mousedown, false);
    this.domElement.removeEventListener("mousemove", this.mousemove, false);
    this.domElement.removeEventListener("mouseup", this.mouseup, false);

    window.removeEventListener("keydown", this.keydown, false);
    window.removeEventListener("keyup", this.keyup, false);
  }
}

export { ObjectControls };
