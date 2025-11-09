// Determine if WebGPU is supported, if not, fall back to WebGL
import * as THREE from 'three';
import { ComponentManager } from './component'; 

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
  public renderer: THREE.WebGLRenderer;
  public inputManager: InputManager;
  public componentManager: ComponentManager = new ComponentManager();
  public gui?: GUI;
  public clock: THREE.Clock;

  public static instance: Engine;
  
  constructor(element: HTMLElement, options: EngineOptions = {}) {
    Engine.instance = this;

    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer(options.rendererParameters);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(this.render.bind(this));
    element.appendChild(this.renderer.domElement);

    this.scene.add(this.camera);

    this.inputManager = new InputManager(this.renderer, options.inputManagerOptions || {});
  }

  private render() {
    // Resize renderer and update camera aspect ratio on window resize
    if (this.renderer.domElement.width !== window.innerWidth || this.renderer.domElement.height !== window.innerHeight) {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }

    const deltaTime = this.clock.getDelta();    

    this.inputManager.update(deltaTime);
    this.componentManager.update();

    this.renderer.render(this.scene, this.camera);
  }

}

/**
 * EngineOptions interface for configuring the Engine.
 */
export interface EngineOptions {
  document?: Document;
  rendererParameters?: THREE.WebGLRendererParameters;
  inputManagerOptions?: InputManagerOptions;
}
