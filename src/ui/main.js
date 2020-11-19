// UI & Events
const dead = document.querySelector("h1#dead");
const restart = document.querySelector("h1#restart");

document.addEventListener("player", (e) => {
  const object = e.detail.object;
  const color = object.material.color;

  if (object.name === "floor") {
    // restart
    dead.style.display = "block";
    setTimeout(() => {
      restart.style.display = "block";
    }, 3000);
    // document.dispatchEvent(new Event("lose"))
  } else if (object.name === "randomCube") {
    // make the cube start falling through the ground
    if (color.r > 0.5) {
      object.material = new MeshStandardMaterial({ color: 0x333333 });
    }
  }
});
