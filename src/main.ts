
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshToonMaterial, Mesh, DirectionalLight } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const scene = new Scene()
const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100)

const renderer = new WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const light = new DirectionalLight(0xffffff, 1.0)
scene.add(light)

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