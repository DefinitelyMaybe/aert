import type {
  Object3D,
} from "./deps.ts";

class ObjectControls {
  
  object;
  domElement;
  target:any;
  lock:any;

  constructor(
    object: Object3D,
    domElement: HTMLElement,
  ) {

    this.object = object;
    this.domElement = domElement;

    this.domElement.addEventListener("mousedown", (event) => {
      console.log("click event");
      this.domElement.requestPointerLock()
    })

    this.domElement.addEventListener("pointerlockchange", (event) => {
      console.log("pointerchange");
      if (document.pointerLockElement === this.domElement) {
        console.log("Locked");
      } else {
        console.log("unlocked");
      }
    })

    // this.movementSpeed = 1.0;
    // this.movementSpeedMultiplier = 1.0;

    // this.domElement.addEventListener("contextmenu", this.contextmenu, false);

    // this.domElement.addEventListener("mousemove", this.mousemove, false);
    // this.domElement.addEventListener("mousedown", this.mousedown, false);
    // this.domElement.addEventListener("mouseup", this.mouseup, false);

    // window.addEventListener("keydown", this.keydown, false);
    // window.addEventListener("keyup", this.keyup, false);
  }

  keydown(event: KeyboardEvent) {
    // if (event.altKey) {
    //   return;
    // }

    // //event.preventDefault();

    // switch (event.code) {
    //   case "shift":
    //     this.movementSpeedMultiplier = .1;
    //     break;
    //   case "w":
    //     this.moveState.forward = 1;
    //     break;
    //   case "s":
    //     this.moveState.back = 1;
    //     break;

    //   case "a":
    //     this.moveState.left = 1;
    //     break;
    //   case "d":
    //     this.moveState.right = 1;
    //     break;
    //   case "r":
    //     this.moveState.up = 1;
    //     break;
    //   case "f":
    //     this.moveState.down = 1;
    //     break;
    //   case "up":
    //     this.moveState.pitchUp = 1;
    //     break;
    //   case "down":
    //     this.moveState.pitchDown = 1;
    //     break;
    //   case "left":
    //     this.moveState.yawLeft = 1;
    //     break;
    //   case "right":
    //     this.moveState.yawRight = 1;
    //     break;
    //   case "q":
    //     this.moveState.rollLeft = 1;
    //     break;
    //   case "e":
    //     this.moveState.rollRight = 1;
    //     break;
    // }

    // this.updateMovementVector();
    // this.updateRotationVector();
  }

  keyup(event: KeyboardEvent) {
    // switch (event.key) {
    //   case "shift":
    //     this.movementSpeedMultiplier = 1;
    //     break;
    //   case "w":
    //     this.moveState.forward = 0;
    //     break;
    //   case "s":
    //     this.moveState.back = 0;
    //     break;
    //   case "a":
    //     this.moveState.left = 0;
    //     break;
    //   case "d":
    //     this.moveState.right = 0;
    //     break;
    //   case "r":
    //     this.moveState.up = 0;
    //     break;
    //   case "f":
    //     this.moveState.down = 0;
    //     break;
    //   case "up":
    //     this.moveState.pitchUp = 0;
    //     break;
    //   case "down":
    //     this.moveState.pitchDown = 0;
    //     break;
    //   case "left":
    //     this.moveState.yawLeft = 0;
    //     break;
    //   case "right":
    //     this.moveState.yawRight = 0;
    //     break;
    //   case "q":
    //     this.moveState.rollLeft = 0;
    //     break;
    //   case "e":
    //     this.moveState.rollRight = 0;
    //     break;
    // }

    // this.updateMovementVector();
    // this.updateRotationVector();
  }

  mousedown(event: MouseEvent) {
    // this.domElement.focus();

    // event.preventDefault();
    // event.stopPropagation();

    // if (false /*this.dragToLook*/) {
    //   // this.mouseStatus++;
    // } else {
    //   switch (event.button) {
    //     case 0:
    //       this.moveState.forward = 1;
    //       break;
    //     case 2:
    //       this.moveState.back = 1;
    //       break;
    //   }

    //   this.updateMovementVector();
    // }
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
    // event.preventDefault();
    // event.stopPropagation();

    // if (false /*this.dragToLook*/) {
    //   // this.mouseStatus--;

    //   // this.moveState.yawLeft = this.moveState.pitchDown = 0;
    // } else {
    //   switch (event.button) {
    //     case 0:
    //       this.moveState.forward = 0;
    //       break;
    //     case 2:
    //       this.moveState.back = 0;
    //       break;
    //   }

    //   this.updateMovementVector();
    // }

    // this.updateRotationVector();
  }

  contextmenu(event: Event) {
    event.preventDefault();
  }
}

export { ObjectControls };
