/// <reference lib="dom" />
import { Tweakpane } from "./deps.ts";
import { spawnCubes } from "./helpers.ts";
import {
  camera,
  clock,
  player,
  renderer,
  scene,
  state,
  world,
} from "./worlds/devworld.ts";

// ---------------- Variables --------------------

// tweakpane
export const pane = new Tweakpane.default();

// ---------------- Functions --------------------
// game loop
function animate() {
  requestAnimationFrame(animate);

  if (state.running) {
    const delta = clock.getDelta();

    // make a physics step
    world.step(delta, undefined, undefined);

    // update rendered positions
    scene.traverse((object) => {
      if (object.isCube) {
        object.quaternion.x = object.body.quaternion.x;
        object.quaternion.y = object.body.quaternion.y;
        object.quaternion.z = object.body.quaternion.z;
        object.quaternion.w = object.body.quaternion.w;

        object.position.x = object.body.position.x;
        object.position.y = object.body.position.y;
        object.position.z = object.body.position.z;
      }
    });

    // camera position must be updated
    // velocity may move object position
    player.controls.update();

    // finally make the render to screen
    renderer.render(scene, camera);

    // refresh the pane to update any values
    pane.refresh();
  }
}

// ---------------- Events --------------------
window.addEventListener("visibilitychange", () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
  if (document.visibilityState === "hidden") {
    state.running = false;
    clock.stop();
  } else {
    // get ready to run again
    clock.start();
    state.running = true;
  }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

// document.addEventListener('mousedown',  (e) => {
//   console.log({event:e.target});
// })

// finially start renderering
state.running = true;
spawnCubes(scene);

animate();

export {
  clock,
  player,
  renderer,
  scene,
  state,
  world,
} from "./worlds/devworld.ts";
