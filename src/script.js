import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */

// Debug
const gui = new GUI({ width: 500 });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const parameters = {
  count: 50000,
  size: 0.01,
  radius: 10,
  branches: 5,
  spin: 0.4,
  randomness: 1,
  randomnessPower: 0.43,
  color: 0xff5588,
};

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
  /**
   *
   * Dispose
   *
   */
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  /**
   *
   * Geometry
   *
   */
  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);

  for (let i = 0; i < parameters.count; i++) {
    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    const randomX = Math.pow(
      Math.random(),
      parameters.randomnessPower * (Math.random() < 0.5 ? 1 : -1)
    );
    const randomY = Math.pow(
      Math.random(),
      parameters.randomnessPower * (Math.random() < 0.5 ? 1 : -1)
    );
    const randomZ = Math.pow(
      Math.random(),
      parameters.randomnessPower * (Math.random() < 0.5 ? 1 : -1)
    );

    positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i * 3 + 1] = randomY;
    positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  /**
   *
   * Material
   *
   */
  material = new THREE.PointsMaterial({
    color: parameters.color,
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  /**
   *
   * Points
   *
   */
  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

/**
 * Debug
 */
gui
  .add(parameters, "count")
  .min(0)
  .max(100000)
  .onFinishChange(() => generateGalaxy());
gui
  .add(parameters, "size")
  .min(0.01)
  .max(1)
  .step(0.01)
  .onFinishChange(() => generateGalaxy());
gui
  .add(parameters, "radius")
  .min(0)
  .max(20)
  .step(1)
  .onFinishChange(() => generateGalaxy());
gui
  .add(parameters, "branches")
  .min(0)
  .max(20)
  .step(1)
  .onFinishChange(() => generateGalaxy());
gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(0.1)
  .onFinishChange(() => generateGalaxy());
gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.1)
  .onFinishChange(() => generateGalaxy());

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
