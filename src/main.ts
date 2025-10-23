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
    camera.rotation.x -= value * 0.002;
  }
});

engine.inputManager.bindAction({
  name: 'RotateCameraX',
  type: 'mouse',
  code: MouseCodes.X,
  callback: (value: number) => {
    camera.rotation.y -= value * 0.002;
  }
});

function render() {

  renderer.render(scene, camera);
}

