import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshToonMaterial, Mesh, DirectionalLight, Object3D, GridHelper, Vector3 } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"


const renderer = new WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene = new Scene()
const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(10, 10, 10)
camera.lookAt(new Vector3(0, 0, 0))

const controls = new OrbitControls(camera, renderer.domElement)

const light = new DirectionalLight(0xffffff, 1.0)
const lightTarget = new Object3D()
scene.add(lightTarget)
lightTarget.position.set(-1, -1, -1)

light.target = lightTarget
scene.add(light)

const gridHelper = new GridHelper(100, 100)
scene.add(gridHelper)

const geometry = new BoxGeometry();
const material = new MeshToonMaterial( { color: 0x00ff00 } );
const cube = new Mesh( geometry, material );

scene.add( cube );

camera.position.z = 5;

function animate() {
  requestAnimationFrame( animate );

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render( scene, camera );
};

animate();