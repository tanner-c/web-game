import * as THREE from 'three';
import { Engine } from './engine';

const engine = new Engine({
  rendererParameters: {
    antialias: true
  },
  inputManagerOptions: {
    freeOrbitCam: true,
  },
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
scene.add(floorMesh);

const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshPhysicalMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = 1;

// Initialize light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);

scene.add(light);


scene.add(cube);

function render() {

  renderer.render(scene, camera);
}

