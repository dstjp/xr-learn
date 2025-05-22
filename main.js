import * as THREE from "three";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";

let camera, scene, renderer;
let controller1, controller2;
let controllerGrip1, controllerGrip2;
let raycaster, intersected;
let canvasPanel, canvasTexture, canvasContext;
let isInVR = false;

init();
animate();

function createControllerModel() {
  // Create a simple controller model as fallback
  const geometry = new THREE.BoxGeometry(0.08, 0.08, 0.08);
  const material = new THREE.MeshPhongMaterial({
    color: 0x888888,
  });
  const mesh = new THREE.Mesh(geometry, material);

  // Add grip part
  const gripGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 8);
  const gripMesh = new THREE.Mesh(gripGeometry, material);
  gripMesh.position.y = -0.05;
  gripMesh.rotation.x = Math.PI / 2;
  mesh.add(gripMesh);

  return mesh;
}

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x505050);

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    10
  );
  camera.position.set(0, 1.6, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Initialize raycaster
  raycaster = new THREE.Raycaster();

  // Create canvas texture
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 180;
  canvasContext = canvas.getContext("2d");
  canvasContext.fillStyle = "#ffffff";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  // Draw some sample content
  canvasContext.fillStyle = "#000000";
  canvasContext.font = "20px Arial";
  canvasContext.fillText("Interactive Canvas Panel", 60, 90);
  canvasContext.fillText("Click Enter VR to begin", 70, 120);

  canvasTexture = new THREE.CanvasTexture(canvas);
  canvasTexture.needsUpdate = true;

  // Create panel mesh
  const panelGeometry = new THREE.PlaneGeometry(1.6, 0.9); // Maintaining 16:9 ratio but scaled up
  const panelMaterial = new THREE.MeshBasicMaterial({
    map: canvasTexture,
    side: THREE.DoubleSide,
  });
  canvasPanel = new THREE.Mesh(panelGeometry, panelMaterial);
  canvasPanel.position.set(0, 1.6, -2); // Positioned 2 meters in front at eye level
  scene.add(canvasPanel);

  // Controllers setup
  const controllerModelFactory = new XRControllerModelFactory();

  // Controller 1
  controller1 = renderer.xr.getController(0);
  controller1.addEventListener("selectstart", onSelectStart);
  controller1.addEventListener("selectend", onSelectEnd);
  scene.add(controller1);

  controllerGrip1 = renderer.xr.getControllerGrip(0);
  try {
    const model = controllerModelFactory.createControllerModel(controllerGrip1);
    controllerGrip1.add(model);
  } catch (error) {
    console.warn("Falling back to basic controller model for controller 1");
    controllerGrip1.add(createControllerModel());
  }
  scene.add(controllerGrip1);

  // Controller 2
  controller2 = renderer.xr.getController(1);
  controller2.addEventListener("selectstart", onSelectStart);
  controller2.addEventListener("selectend", onSelectEnd);
  scene.add(controller2);

  controllerGrip2 = renderer.xr.getControllerGrip(1);
  try {
    const model = controllerModelFactory.createControllerModel(controllerGrip2);
    controllerGrip2.add(model);
  } catch (error) {
    console.warn("Falling back to basic controller model for controller 2");
    controllerGrip2.add(createControllerModel());
  }
  scene.add(controllerGrip2);

  // Visual ray line
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -1),
  ]);
  const material = new THREE.LineBasicMaterial({
    color: 0xffffff,
  });
  const line = new THREE.Line(geometry, material);
  line.scale.z = 5;
  line.name = "ray";

  controller1.add(line.clone());
  controller2.add(line.clone());

  // Add lights
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x666666));

  // VR Button with session change listener
  const vrButton = VRButton.createButton(renderer);
  document.body.appendChild(vrButton);

  // Listen for VR session start/end
  renderer.xr.addEventListener("sessionstart", () => {
    isInVR = true;
    console.log("VR session started");
  });

  renderer.xr.addEventListener("sessionend", () => {
    isInVR = false;
    console.log("VR session ended");
  });

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onSelectStart(event) {
  if (!isInVR) return; // Only handle interactions in VR mode

  const controller = event.target;
  const intersections = getIntersections(controller);

  if (intersections.length > 0) {
    const intersection = intersections[0];
    // Handle interaction with the canvas panel
    console.log("Canvas panel clicked at:", intersection.point);

    // Update canvas texture with interaction point
    const point = intersection.point;
    canvasContext.fillStyle = "#ff0000";
    canvasContext.beginPath();
    canvasContext.arc(
      (point.x + 0.8) * (320 / 1.6), // Convert 3D coordinates to 2D canvas coordinates
      (point.y + 0.45) * (180 / 0.9),
      5,
      0,
      Math.PI * 2
    );
    canvasContext.fill();
    canvasTexture.needsUpdate = true;
  }
}

function onSelectEnd(event) {
  // Handle selection end if needed
}

function getIntersections(controller) {
  if (!isInVR) return []; // Return empty array if not in VR

  const tempMatrix = new THREE.Matrix4();
  tempMatrix.identity().extractRotation(controller.matrixWorld);

  raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
  raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

  return raycaster.intersectObject(canvasPanel);
}

function animate() {
  if (!renderer.xr.isPresenting) {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  } else {
    renderer.setAnimationLoop(render);
  }
}

function render() {
  // Only check for intersections in VR mode
  if (isInVR) {
    const intersections = getIntersections(controller1);
    if (intersections.length > 0) {
      if (!intersected) {
        intersected = intersections[0].object;
        intersected.material.emissive = new THREE.Color(0x666666);
      }
    } else {
      if (intersected) {
        intersected.material.emissive = new THREE.Color(0x000000);
        intersected = null;
      }
    }

    // Check second controller as well
    const intersections2 = getIntersections(controller2);
    if (intersections2.length > 0 && !intersected) {
      intersected = intersections2[0].object;
      intersected.material.emissive = new THREE.Color(0x666666);
    }
  }

  renderer.render(scene, camera);
}
