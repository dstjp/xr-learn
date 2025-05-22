import * as THREE from "three";

export class ControllerRay {
  constructor(isLeftController = false) {
    this.isLeftController = isLeftController;

    // Create the ray line with multiple segments for better visibility
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -5), // Make the line 5 units long directly
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    this.material = new THREE.LineBasicMaterial({
      color: 0xffffff,
    });

    this.ray = new THREE.Line(geometry, this.material);
    this.ray.name = "ray";

    // Create an additional line for the active state
    const activeGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -5),
    ]);

    this.activeMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000,
    });

    this.activeRay = new THREE.Line(activeGeometry, this.activeMaterial);
    this.activeRay.visible = false;
    this.ray.add(this.activeRay);

    // Store original color for reverting
    this.defaultColor = 0xffffff;
    this.activeColor = 0xff0000;
  }

  getMesh() {
    return this.ray;
  }

  setActive(active) {
    if (this.isLeftController) {
      // Toggle visibility of the active ray instead of changing material properties
      this.activeRay.visible = active;
      this.ray.material.color.setHex(
        active ? this.activeColor : this.defaultColor
      );
    }
  }

  update() {
    // Add any update logic here if needed
  }
}
