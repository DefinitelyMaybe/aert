import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshToonMaterial, Mesh, DirectionalLight, Object3D, GridHelper, Vector3, PlaneBufferGeometry, DoubleSide } from "three"
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

const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(10, 10, 10)
camera.lookAt(new Vector3(0, 0, 0))

const gridHelper = new GridHelper(100, 100)
scene.add(gridHelper)

const plane = new PlaneBufferGeometry(100, 100, 1, 1)
plane.rotateX(-Math.PI/2)
let material = new MeshToonMaterial({color:0xffffff})
const floor = new Mesh(plane, material)
scene.add(floor)

const geometry = new BoxGeometry();
material = new MeshToonMaterial( { color: 0x00ff00 } );
const cube = new Mesh( geometry, material );
cube.position.setY(1)
scene.add( cube );

const controls = new OrbitControls(camera, renderer.domElement)
controls.target = cube.position

camera.position.x = 5;

function animate() {
  requestAnimationFrame( animate );

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  renderer.render( scene, camera );
};

animate();

// UI

const testButton = document.getElementById("test")
testButton.onclick = (e) => {
  console.log(e)
  cube.position.set(0,0,0)
}