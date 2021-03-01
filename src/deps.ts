/// <reference lib="dom" />
export {
  BoxGeometry,
  BufferGeometry,
  Camera,
  CameraHelper,
  CircleGeometry,
  Clock,
  Color,
  DirectionalLight,
  DirectionalLightHelper,
  Euler,
  EventDispatcher,
  FogExp2,
  Group,
  HemisphereLight,
  Line,
  LineBasicMaterial,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MOUSE,
  Object3D,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Quaternion,
  Raycaster,
  Scene,
  Spherical,
  TOUCH,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "https://cdn.skypack.dev/three?dts";
// continue to export from here because these files really should be from the import above
// they're not yet. must wait for es module support across examples folder of three.js
export {
  AABB,
  Body,
  Box,
  Material,
  NaiveBroadphase,
  Plane,
  Quaternion as Quat,
  Sphere,
  Vec3,
  World,
} from "https://cdn.skypack.dev/cannon-es";
export * as Tweakpane from "https://cdn.skypack.dev/tweakpane?dts";
// export {
//   Pathfinding,
//   PathfindingHelper,
// } from "https://cdn.skypack.dev/three-pathfinding?dts";

// https://www.skypack.dev/view/@tensorflow/tfjs-core
// import tensorflowTfjsCore from 'https://cdn.skypack.dev/@tensorflow/tfjs-core';

// https://www.skypack.dev/view/@tensorflow/tfjs-backend-webgl
// import tensorflowTfjsBackendWebgl from 'https://cdn.skypack.dev/@tensorflow/tfjs-backend-webgl';

// https://www.skypack.dev/view/@tensorflow/tfjs-backend-webgpu
// import tensorflowTfjsBackendWebgpu from 'https://cdn.skypack.dev/@tensorflow/tfjs-backend-webgpu';