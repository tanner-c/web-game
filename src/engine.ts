// Determine if WebGPU is supported, if not, fall back to WebGL
import * as THREE from 'three/webgpu';
import { EntityManager } from './entity'; 
import { WebGPURendererParameters } from 'three/src/renderers/webgpu/WebGPURenderer.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui';

import config from '../public/config.json';

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
  private freeCam: boolean;
  private freeCamRotiationSpeed: number;

  private mousePosition: THREE.Vector2 = new THREE.Vector2();
  private mouseDelta: THREE.Vector2 = new THREE.Vector2();

  private actions: InputAction[] = [];

  private eventListeners: { [key: string]: EventListenerOrEventListenerObject } = {};

  constructor(camera: THREE.PerspectiveCamera, renderer: THREE.WebGPURenderer, options: InputManagerOptions) {
    this.camera = camera;
    this.renderer = renderer;

    // Options overrides config, merge into one object
    const mergedOptions = {
      ...config.InputManager,
      ...options,
    };

    this.freeCam = mergedOptions.freeCam.enabled;
    this.freeCamRotiationSpeed = mergedOptions.freeCam.rotationSpeed;

    this.bindEvents();
  }

  public update() {
    if (this.freeCam) {
      this.camera.rotation.y -= this.mouseDelta.x * this.freeCamRotiationSpeed;
      this.camera.rotation.x -= this.mouseDelta.y * this.freeCamRotiationSpeed;
    }
  }

  private onMouseMove(event: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();

    this.mousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mousePosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.mouseDelta.x = event.movementX;
    this.mouseDelta.y = event.movementY;
  }

  private onKeyDown(event: KeyboardEvent) {
    // Handle keydown events here
  }

  private onKeyUp(event: KeyboardEvent) {
    // Handle keyup events here
  }

  private onGamepadConnected(event: GamepadEvent) {
    // Handle gamepad connection here
  }

  private onGamepadDisconnected(event: GamepadEvent) {
    // Handle gamepad disconnection here
  }

  private bindEvents() {
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);


    // Intercept all key events
    window.addEventListener('keydown', this.onKeyDown.bind(this), false);
    window.addEventListener('keyup', this.onKeyUp.bind(this), false);

    // Intercept gamepad events
    window.addEventListener('gamepadconnected', this.onGamepadConnected.bind(this), false);
    window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected.bind(this), false);
  }

}


// Define InputAction interface
// This represents a mapping between an input event and an action in the engine
// Keyboard codes are already standardized in the KeyboardEvent.code property
// Gamepad API uses a polling based approach, so we will define buttons and axes by our own convention as shown below InputAction
export interface InputAction {
  name: string;
  type: 'keyboard' | 'mouse' | 'gamepad';
  code: string;
  value: number;
  callback: (value: number) => void;
}

// Define Gamepad Button and Axis codes
export const GamepadButtons = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  LB: 4,
  RB: 5,
  LT: 6,
  RT: 7,
  BACK: 8,
  START: 9,
  LS: 10,
  RS: 11,
  DPAD_UP: 12,
  DPAD_DOWN: 13,
  DPAD_LEFT: 14,
  DPAD_RIGHT: 15,
};

export const GamepadAxes = {
  LEFT_STICK_X: 0,
  LEFT_STICK_Y: 1,
  RIGHT_STICK_X: 2,
  RIGHT_STICK_Y: 3,
};

// EngineOptions
export interface EngineOptions {
  document?: Document;
  rendererParameters?: WebGPURendererParameters;
  inputManagerOptions?: InputManagerOptions;
}

export interface InputManagerOptions {
  freeCam?: {
    enabled: boolean;
    rotationSpeed: number;
  }
}