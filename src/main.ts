import * as THREE from 'three';
import { Engine, MouseCodes } from './engine';
import { Entity } from './entity';

const engine = new Engine({
  rendererParameters: {
    antialias: true
  }
});

const { scene, camera, renderer } = engine;

// Create floor
const floor = new THREE.BoxGeometry(10, 1, 10);
const material = new THREE.MeshPhysicalMaterial({
  color: '#df1010ff',
  roughness: 0.5,
  metalness: 0.5,
});

const floorMesh = new THREE.Mesh(floor, material);
floorMesh.position.y = -0.5;
const floorEntity = new Entity(floorMesh, scene);

const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshPhysicalMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = 1;
const cubeEntity = new Entity(cube, scene);

// Initialize light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
const lightEntity = new Entity(light, scene);

scene.add(cube);

engine.inputManager.bindAction({
  name: 'RotateCameraY',
  type: 'mouse',
  code: MouseCodes.Y,
  callback: (value: number) => {
    // pitch (local X). invert/scale as needed.
    const pitchDelta = -value * 0.001;
    camera.rotateX(pitchDelta);

    // clamp pitch to avoid flipping
    const limit = Math.PI / 2 - 0.01;
    camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x, -limit, limit);
  }
});

engine.inputManager.bindAction({
  name: 'RotateCameraX',
  type: 'mouse',
  code: MouseCodes.X,
  callback: (value: number) => {
    // yaw around world up (use camera.up to respect configured up vector)
    const yawDelta = -value * 0.001;
    const up = camera.up.clone().normalize();
    camera.rotateOnWorldAxis(up, yawDelta);
  }
});

engine.inputManager.bindAction({
  name: 'ZoomCamera',
  type: 'mouse',
  code: MouseCodes.WHEEL_UP,
  callback: (value: number) => {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);                 // world forward vector
    camera.position.addScaledVector(dir, -value * 0.1); // move forward on wheel up
  }
});

engine.inputManager.bindAction({
  name: 'ZoomOutCamera',
  type: 'mouse',
  code: MouseCodes.WHEEL_DOWN,
  callback: (value: number) => {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    camera.position.addScaledVector(dir, value * 0.1); // move back on wheel down
  }
});

function render() {

  renderer.render(scene, camera);
}

