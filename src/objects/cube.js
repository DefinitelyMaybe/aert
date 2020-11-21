import {
  Body,
  Box,
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  Vec3,
} from "../deps.js";

export class Cube extends Mesh {
  defaultMaterial = new MeshStandardMaterial({ color: 0xaaaaaa });

  constructor(options = {}) {
    super();
    Object.defineProperty(this, "isCube", { value: true });
    this.width = options.width ? options.width : 1;
    this.height = options.height ? options.height : 1;
    this.depth = options.depth ? options.depth : 1;

    this.geometry = new BoxGeometry(this.width, this.height, this.depth);
    this.material = options.material ? options.material : this.defaultMaterial;

    // add physics
    const cube = new Box(
      new Vec3(this.width / 2, this.height / 2, this.depth / 2),
    );
    const mass = options.mass ? options.mass : 1;
    this.body = new Body({ mass: mass });
    this.body.addShape(cube);
  }
}
