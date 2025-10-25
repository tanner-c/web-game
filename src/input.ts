import * as THREE from 'three/webgpu';
import { Engine } from './engine';


export interface InputManagerOptions {
  freeCam?: {
    enabled: boolean;
    rotationSpeed: number;
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

export class InputManager {
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGPURenderer;


  // InputActions are mapped according to their type:code for easy lookup
  private actions: Map<string, InputAction> = new Map();

  private gamepads: Map<number, Gamepad> = new Map();

  constructor(camera: THREE.PerspectiveCamera, renderer: THREE.WebGPURenderer, options: InputManagerOptions) {
    this.camera = camera;
    this.renderer = renderer;

    // Options overrides config, merge into one object

    this.bindEvents();
  }

  public update() {

  }

  public bindAction(action: InputAction) {
    this.actions.set(`${action.type}:${action.code}`, action);
  }

  private onMouseDown(event: MouseEvent) {
    // Request pointer lock
    this.renderer.domElement.requestPointerLock();
  }

  private onMouseMove(event: MouseEvent) {
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
    window.addEventListener('mousedown', this.onMouseDown.bind(this), false);

    // Intercept all key events
    window.addEventListener('keydown', this.onKeyDown.bind(this), false);
    window.addEventListener('keyup', this.onKeyUp.bind(this), false);

    // Intercept gamepad events
    window.addEventListener('gamepadconnected', this.onGamepadConnected.bind(this), false);
    window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected.bind(this), false);
  }

}

