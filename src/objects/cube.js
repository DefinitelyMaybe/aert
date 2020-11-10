import { BoxGeometry, Box, Body } from "../deps.js"

export class Cube extends BoxGeometry {
  constructor(
    width,
    height,
    depth,
    widthSegments,
    heightSegments,
    depthSegments,
  ){
    super()

    this.parameters = {
      width: width,
      height: height,
      depth: depth,
      widthSegments: widthSegments,
      heightSegments: heightSegments,
      depthSegments: depthSegments,
    };

    this.fromBufferGeometry(
      new BoxBufferGeometry(
        width,
        height,
        depth,
        widthSegments,
        heightSegments,
        depthSegments,
      ),
    );

    this.mergeVertices();
    
    const cube = new Box(new Vec3(1, 1, 1));
    const cubeBody = new Body({ mass: 1 });
    cubeBody.addShape(cube);
    this.
    
  }
}