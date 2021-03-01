import {
  Body,
  Box,
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  Vec3,
} from "../../deps.ts";

export class Cube extends Mesh {
  body: Body;

  width: number;
  height: number;
  depth: number;

  isCube = true;

  constructor(options = {
    material: undefined,
    width: 1,
    height: 1,
    depth: 1,
    mass: 1,
  }) {
    super();
    this.width = options.width;
    this.height = options.height;
    this.depth = options.depth;

    this.geometry = new BoxGeometry(this.width, this.height, this.depth);
    this.material = options.material
      ? options.material
      : new MeshStandardMaterial({ color: 0xaaaaaa });

    // add physics
    const cube = new Box(
      new Vec3(this.width / 2, this.height / 2, this.depth / 2),
    );
    const mass = options.mass;
    this.body = new Body({ mass: mass });
    this.body.addShape(cube, undefined, undefined);
  }
}
