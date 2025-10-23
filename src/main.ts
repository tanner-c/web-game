import * as THREE from 'three';
import { Engine } from './engine';

const engine = new Engine();
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
scene.add(floorMesh);

const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

function render() {

  renderer.render(scene, camera);
}

