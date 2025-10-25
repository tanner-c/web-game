// Determine if WebGPU is supported, if not, fall back to WebGL
import * as THREE from 'three/webgpu';
import { ComponentManager } from './component'; 
import { WebGPURendererParameters } from 'three/src/renderers/webgpu/WebGPURenderer.js';
import { InputManager, InputManagerOptions } from './input';
import GUI from 'lil-gui';


/**
 * Engine class to set up a basic Three.js scene with camera, renderer, and controls.
 * @class Engine
 * @example
 * const engine = new Engine();
 * const { scene, camera, renderer } = engine;
 */
export class Engine {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGPURenderer;
  public inputManager: InputManager;
  public componentManager: ComponentManager = new ComponentManager();
  public gui?: GUI;

  public static instance: Engine;
  
  constructor(options: EngineOptions = {}) {
    Engine.instance = this;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGPURenderer(options.rendererParameters);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(this.render.bind(this));
    document.body.appendChild(this.renderer.domElement);

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
    this.componentManager.update();

    this.renderer.render(this.scene, this.camera);
  }

}

// EngineOptions
export interface EngineOptions {
  document?: Document;
  rendererParameters?: WebGPURendererParameters;
  inputManagerOptions?: InputManagerOptions;
}
