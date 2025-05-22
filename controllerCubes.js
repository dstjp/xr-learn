import * as THREE from "three";

export class ControllerCube {
  constructor() {
    // Create cube geometry
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.8,
    });
    this.cube = new THREE.Mesh(geometry, material);

    // Add a small offset to make the cube visible above the controller
    this.cube.position.y = 0.05;
  }

  getMesh() {
    return this.cube;
  }

  update(controller) {
    // The cube will automatically update its position as it's a child of the controller
    // But you can add additional update logic here if needed
  }
}
