// Determine if WebGPU is supported, if not, fall back to WebGL
import * as THREE from 'three/webgpu';
import { WebGPURendererParameters } from 'three/src/renderers/webgpu/WebGPURenderer.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui';

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
  public renderer: THREE.WebGPURenderer;
  public inputManager: InputManager;
  public gui?: GUI;
  
  constructor(options: EngineOptions = {}) {
    this.document = document;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGPURenderer(options.rendererParameters);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(this.render.bind(this));
    this.document.body.appendChild(this.renderer.domElement);

    // Initialize camera
    this.camera.position.z = 5;

    // Initialize light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    this.scene.add(light);

    this.inputManager = new InputManager(this, options.inputManagerOptions || {});
  }

  private render() {
    // Resize renderer and update camera aspect ratio on window resize
    if (this.renderer.domElement.width !== window.innerWidth || this.renderer.domElement.height !== window.innerHeight) {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }

    this.renderer.render(this.scene, this.camera);
  }

  private initializeGui() {
    const gui = new GUI();

    this.gui = gui;

    const mainMenu = gui.addFolder('Main Menu');
    mainMenu.open();

  }
}

export class InputManager {
  private engine: Engine;
  private freeOrbitCam: boolean;
  private controls?: OrbitControls;

  constructor(engine: Engine, options: InputManagerOptions) {
    this.engine = engine;
    this.freeOrbitCam = options.freeOrbitCam ?? true;

    if (this.freeOrbitCam) {
      this.controls = new OrbitControls(this.engine.camera, this.engine.renderer.domElement);
    }
  }

}

// EngineOptions
export interface EngineOptions {
  document?: Document;
  rendererParameters?: WebGPURendererParameters;
  inputManagerOptions?: InputManagerOptions;
}

export interface InputManagerOptions {
  freeOrbitCam?: boolean;
}