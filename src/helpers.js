import { player, scene } from "./main.js";
import { Cube } from "./objects/cube.js";

export function spawnCubes() {
  // spawn red cubes somewhere within the current floor
  for (let i = 0; i < 100; i++) {
    const cube = new Cube({ width: 2, height: 2, depth: 2, mass: 0 });
    const scalar = 50;
    const Xsign = Math.random() < 0.5 ? -1 : 1;
    const Zsign = Math.random() < 0.5 ? -1 : 1;
    const posX = Xsign * Math.random() * scalar;
    const posY = 2;
    const posZ = Zsign * Math.random() * scalar;
    cube.body.position.set(
      posX,
      posY,
      posZ,
    );
    cube.name = "randomCube";
    cube.castShadow = true;
    cube.receiveShadow = true;

    scene.add(cube);
  }
}

export function moveGreenCube() {
  const scalar = 50;
  const Xsign = Math.random() < 0.5 ? -1 : 1;
  const Zsign = Math.random() < 0.5 ? -1 : 1;
  player.body.position.set(
    Xsign * Math.random() * scalar,
    30,
    Zsign * Math.random() * scalar,
  );
}

export function castRay(e) {
  if (castRayElement.checked) {
    console.log("casting ray");
    // throw out a ray and find a random object
    const rayCaster = new Raycaster();
    rayCaster.setFromCamera(
      new Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      ),
      camera,
    );
    const intersection = rayCaster.intersectObject(scene, true);

    // draw the line that was raycasted
    const direction = rayCaster.ray.direction.multiplyScalar(50);
    const p0 = rayCaster.ray.origin;
    const p1 = new Vector3(p0.x, p0.y, p0.z).add(direction);
    const p2 = new Vector3(p1.x, p1.y, p1.z).add(direction);

    const points = [];
    points.push(p0);
    points.push(p1);
    points.push(p2);
    prevRay.geometry.setFromPoints(points);

    //check intersection
    if (intersection.length > 0) {
      const obj = intersection[0].object;
      console.log(`intersected with ${intersection.length} objects`);

      if (changeOrbitElement.checked) {
        console.log(`controls changed to ${obj.name}`);
        // controls.target = obj.position;
      }
    }
  }
}
