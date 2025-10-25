import * as THREE from 'three';
import { Engine } from './engine';
import { Component } from './component';
import { FreeCamComponent } from './camera';

const engine = new Engine({
  rendererParameters: {
    antialias: true
  }
});

const { scene } = engine;

// Create floor
const floor = new THREE.BoxGeometry(10, 1, 10);
const material = new THREE.MeshPhysicalMaterial({
  color: '#df1010ff',
  roughness: 0.5,
  metalness: 0.5,
});

const floorMesh = new THREE.Mesh(floor, material);
floorMesh.position.y = -0.5;

const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshPhysicalMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = 1;

const cubeRotateComponent = new Component(cube, () => {
  cubeRotateComponent.object3D.rotation.x += 0.01;
});

// Initialize light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);

const dayCycleComponent = new Component(light, () => {
  const time = Date.now() * 0.0005;
  light.position.x = Math.sin(time) * 10;
  light.position.z = Math.cos(time) * 10;
  light.position.y = Math.sin(time * 2) * 5 + 5;
});

const freeCam = new FreeCamComponent(engine.camera);

engine.camera.position.set(0, 2, 5);

scene.add(floorMesh);
scene.add(light);
scene.add(cube);