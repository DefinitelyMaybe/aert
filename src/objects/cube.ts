import {
  Body,
  Box,
  BoxGeometry,
  Object3D,
  MeshStandardMaterial,
  Vec3,
} from "../deps.ts";

export class Cube extends Object3D {
  
  body: Body;

  geometry;
  material;

  width: number;
  height: number;
  depth: number;

  constructor(options = {
    material: new MeshStandardMaterial({ color: 0xaaaaaa }),
    width: 1,
    height: 1,
    depth: 1,
    mass: 1
  }) {
    super();
    this.width = options.width;
    this.height = options.height;
    this.depth = options.depth;

    this.geometry = new BoxGeometry(this.width, this.height, this.depth);
    this.material = options.material;

    // add physics
    const cube = new Box(
      new Vec3(this.width / 2, this.height / 2, this.depth / 2),
    );
    const mass = options.mass;
    this.body = new Body({ mass: mass });
    this.body.addShape(cube, undefined, undefined);
  }
}

Cube.prototype.isCube = true;