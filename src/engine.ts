// Determine if WebGPU is supported, if not, fall back to WebGL
import * as THREE from 'three/webgpu';
import { EntityManager } from './entity'; 
import { WebGPURendererParameters } from 'three/src/renderers/webgpu/WebGPURenderer.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui';

import config from './config.json';

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
  public entityManager: EntityManager = new EntityManager();
  public gui?: GUI;
  
  constructor(options: EngineOptions = {}) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGPURenderer(options.rendererParameters);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(this.render.bind(this));
    document.body.appendChild(this.renderer.domElement);

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

  private mousePosition: THREE.Vector2 = new THREE.Vector2();
  private mouseDelta: THREE.Vector2 = new THREE.Vector2();

  // InputActions are mapped according to their type:code for easy lookup
  private actions: Map<string, InputAction> = new Map();

  private gamepads: Map<number, Gamepad> = new Map();

  constructor(camera: THREE.PerspectiveCamera, renderer: THREE.WebGPURenderer, options: InputManagerOptions) {
    this.camera = camera;
    this.renderer = renderer;

    // Options overrides config, merge into one object
    const mergedOptions = {
      ...config.InputManager,
      ...options,
    };

    this.bindEvents();
  }

  public update() {

  }

  public bindAction(action: InputAction) {
    this.actions.set(`${action.type}:${action.code}`, action);
  }

  private onMouseMove(event: MouseEvent) {
    this.renderer.domElement.requestPointerLock();


    // Actions will likely only need the delta, so grab that from the event and search the Map for any bound actions
    if (event.movementX !== 0) {
      this.findInputAction('mouse', MouseCodes.X)?.callback(event.movementX);
    }

    if (event.movementY !== 0) {
      this.findInputAction('mouse', MouseCodes.Y)?.callback(event.movementY);
    }
  }

  private onMouseWheel(event: WheelEvent) {
    if (event.deltaY < 0) {
      this.findInputAction('mouse', MouseCodes.WHEEL_UP)?.callback(1);
    } else {
      this.findInputAction('mouse', MouseCodes.WHEEL_DOWN)?.callback(1);
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    this.findInputAction('keyboard', event.code)?.callback(1);
  }

  private onKeyUp(event: KeyboardEvent) {
    this.findInputAction('keyboard', event.code)?.callback(0);
  }

  private onGamepadConnected(event: GamepadEvent) {  
    this.gamepads.set(event.gamepad.index, event.gamepad);
  }

  private onGamepadDisconnected(event: GamepadEvent) {
    this.gamepads.delete(event.gamepad.index);
  }

  private findInputAction(type: 'keyboard' | 'mouse' | 'gamepad', code: string): InputAction | undefined {
    return this.actions.get(`${type}:${code}`);
  }

  private bindEvents() {
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    window.addEventListener('wheel', this.onMouseWheel.bind(this), false);

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
  callback: (value: number) => void;
}

export const MouseCodes = {
  LEFT_BUTTON: 'LeftButton',
  MIDDLE_BUTTON: 'MiddleButton',
  RIGHT_BUTTON: 'RightButton',
  WHEEL_UP: 'WheelUp',
  WHEEL_DOWN: 'WheelDown',
  X: 'X',
  Y: 'Y',
};

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