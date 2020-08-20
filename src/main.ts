import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshToonMaterial, Mesh, DirectionalLight, Object3D, GridHelper, Vector3, PlaneBufferGeometry, DoubleSide, Raycaster, Vector2, Line, BufferGeometry, LineBasicMaterial } from "three"
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
lightTarget.name = 'lightTarget'
scene.add(lightTarget)
scene.add(light)

const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(10, 10, 10)
camera.lookAt(new Vector3(0, 0, 0))
scene.add(camera)

// const gridHelper = new GridHelper(100, 100)
// scene.add(gridHelper)

const plane = new PlaneBufferGeometry(100, 100, 1, 1)
plane.rotateX(-Math.PI/2)
let material = new MeshToonMaterial({color:0x888888})
const floor = new Mesh(plane, material)
floor.name = 'floor'
scene.add(floor)

const geometry = new BoxGeometry();
material = new MeshToonMaterial( { color: 0x00ff00 } );
const cube = new Mesh( geometry, material );
cube.position.setY(1)
cube.name = 'cube'
scene.add( cube );

const controls = new OrbitControls(camera, renderer.domElement)
controls.target = cube.position

const geo = new BufferGeometry()
const mat = new LineBasicMaterial({color:0xff00ff})
const prevRay = new Line(geo, mat)
scene.add(prevRay)

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
  const scalar = 50
  const Xsign = Math.random() < 0.5 ? -1 : 1
  const Zsign = Math.random() < 0.5 ? -1 : 1
  cube.position.set(Xsign*Math.random()* scalar, 1, Zsign*Math.random()* scalar)
}

const test2Button = document.getElementById("test2")
test2Button.onclick = (e) => {
  // respawn a red square somewhere within the current floor
  material = new MeshToonMaterial( { color: 0xff0000 } );
  const cube = new Mesh( geometry, material );
  const scalar = 50
  const Xsign = Math.random() < 0.5 ? -1 : 1
  const Zsign = Math.random() < 0.5 ? -1 : 1
  cube.position.set(Xsign * Math.random() * scalar, 1, Zsign * Math.random() * scalar)
  cube.name = 'randomRedCube'
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
  rayCaster.setFromCamera(new Vector2(( e.clientX / window.innerWidth ) * 2 - 1, - ( e.clientY / window.innerHeight ) * 2 + 1), camera)
  const intersection = rayCaster.intersectObject(scene, true)

  // draw the line that was raycasted
  const direction = rayCaster.ray.direction.multiplyScalar(100)
  const p0 = rayCaster.ray.origin
  const p1 = new Vector3(p0.x, p0.y, p0.z).add(direction)
  const p2 = new Vector3(p1.x, p1.y, p1.z).add(direction)

  const points = []
  points.push(p0)
  points.push(p1)
  points.push(p2)
  const geo = new BufferGeometry()
  prevRay.geometry.setFromPoints(points)

  //check intersection
  if (intersection.length > 0) {

    const obj = intersection[0].object

    controls.target = obj.position
    console.log(`intersected with ${intersection.length} objects`)
    console.log(`controls changed to ${obj.name}`)
  }
}