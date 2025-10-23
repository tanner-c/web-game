// Determine if WebGPU is supported, if not, fall back to WebGL
import * as THREE from 'three/webgpu';
import { EntityManager } from './entity'; 
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
  public entityManager: EntityManager = new EntityManager();
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

    this.inputManager = new InputManager(this.camera, this.renderer, options.inputManagerOptions || {});
  }

  private render() {
    // Resize renderer and update camera aspect ratio on window resize
    if (this.renderer.domElement.width !== window.innerWidth || this.renderer.domElement.height !== window.innerHeight) {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }

    this.inputManager.update();
    this.entityManager.updateEntities();
    
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
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGPURenderer;
  private freeOrbitCam: boolean;

  private mousePosition: THREE.Vector2 = new THREE.Vector2();
  private mouseDelta: THREE.Vector2 = new THREE.Vector2();

  constructor(camera: THREE.PerspectiveCamera, renderer: THREE.WebGPURenderer, options: InputManagerOptions) {
    this.camera = camera;
    this.renderer = renderer;

    this.freeOrbitCam = options.freeOrbitCam ?? true;

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
  

    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  }

  public update() {
    // if (this.freeOrbitCam) {
    //   const rotationSpeed = 0.002;
    //   this.camera.rotation.y -= this.mouseDelta.x * rotationSpeed;
    //   this.camera.rotation.x -= this.mouseDelta.y * rotationSpeed;
    // }
  }

  private onMouseMove(event: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();

    this.mousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mousePosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.mouseDelta.x = event.movementX;
    this.mouseDelta.y = event.movementY;
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