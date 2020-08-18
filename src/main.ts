import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshToonMaterial, Mesh, DirectionalLight, Object3D, GridHelper, Vector3, PlaneBufferGeometry, DoubleSide, Raycaster, Vector2, Line3, Line } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { CannonPhysics } from "three/examples/jsm/physics/CannonPhysics";


const renderer = new WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene = new Scene()

const light = new DirectionalLight(0xffffff, 1.0)
const lightTarget = new Object3D()
lightTarget.position.set(-1, -1, -1)
light.target = lightTarget
scene.add(lightTarget)
scene.add(light)

const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(10, 10, 10)
camera.lookAt(new Vector3(0, 0, 0))

// const gridHelper = new GridHelper(100, 100)
// scene.add(gridHelper)

const plane = new PlaneBufferGeometry(100, 100, 1, 1)
plane.rotateX(-Math.PI/2)
let material = new MeshToonMaterial({color:0x888888})
const floor = new Mesh(plane, material)
scene.add(floor)

const geometry = new BoxGeometry();
material = new MeshToonMaterial( { color: 0x00ff00 } );
const cube = new Mesh( geometry, material );
cube.position.setY(1)
scene.add( cube );

const controls = new OrbitControls(camera, renderer.domElement)
controls.target = cube.position

// camera.position.x = 5;

function animate() {
  requestAnimationFrame( animate );

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render( scene, camera );
};

animate();

// UI

const testButton = document.getElementById("test")
testButton.onclick = (e) => {
  // console.log(e)
  const scalar = 10
  cube.position.set(Math.random()* scalar,Math.random()* scalar,Math.random()* scalar)
}

const test2Button = document.getElementById("test2")
test2Button.onclick = (e) => {
  // console.log(e)
  // respawn a red square somewhere within the current floor
  material = new MeshToonMaterial( { color: 0xff0000 } );
  const cube = new Mesh( geometry, material );
  const scalar = 50
  const Xsign = Math.random() < 0.5 ? -1 : 1
  const Zsign = Math.random() < 0.5 ? -1 : 1
  cube.position.set(Xsign * Math.random() * scalar, 1, Zsign * Math.random() * scalar)
  scene.add( cube );
}

const test3Button = document.getElementById("test3")
test3Button.onclick = (e) => {
  console.log(scene.children)
}

const canvas = document.querySelector('canvas')
canvas.onclick = (e) => {
  console.log("casting ray")
  // throw out a ray and find a random object
  const rayCaster = new Raycaster()
  rayCaster.setFromCamera(new Vector2(e.screenX, e.screenY), camera)
  const intersection = rayCaster.intersectObject(scene, true)

  // draw the line that was raycasted
  const origin = rayCaster.ray.origin
  let direction = rayCaster.ray.direction.multiplyScalar(100)
  const dest = origin.add(direction)

  const geo = new Line3(origin, dest)
  const line = new Line(geo)
  const mat = new MeshToonMaterial({color:0x0000ff})
  const mesh = new Mesh(geo, mat)
  scene.add(mesh)


  if (intersection.length > 0) {
    const obj = intersection[0].object

    controls.target = obj.position
    console.log("controls changed")
  }
}