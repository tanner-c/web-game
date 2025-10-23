import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

/**
 * Engine class to set up a basic Three.js scene with camera, renderer, and controls.
 * @class Engine
 * @example
 * const engine = new Engine();
 * const { scene, camera, renderer } = engine;
 */
export class Engine {
  public document: Document;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls: OrbitControls;
  public gui?: GUI;
  
  constructor(options: EngineOptions = {}) {
    this.document = document;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(this.render.bind(this));
    this.document.body.appendChild(this.renderer.domElement);

    // Initialize camera
    this.camera.position.z = 5;

    // Initialize controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Initialize light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    this.scene.add(light);
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  private initializeGui() {
    const gui = new GUI();

    this.gui = gui;

    const mainMenu = gui.addFolder('Main Menu');
    mainMenu.open();

  }
}

// EngineOptions
export interface EngineOptions {
  document?: Document;
}