import { Component } from "./component";
import * as THREE from 'three/webgpu';
import { Engine, MouseCodes } from "./engine";

export class FreeCamComponent extends Component {
  private camera: THREE.PerspectiveCamera;

  constructor(camera: THREE.PerspectiveCamera) {
    super(camera);
    this.camera = camera;
    this.bindControls();
  }

  private bindControls() {
    const engine = Engine.instance;

    const { camera } = engine;

    engine.inputManager.bindAction({
      name: 'RotateCameraY',
      type: 'mouse',
      code: MouseCodes.Y,
      callback: (value: number) => {
        const pitchDelta = -value * 0.001;
        camera.rotateX(pitchDelta);
      }
    });

    engine.inputManager.bindAction({
      name: 'RotateCameraX',
      type: 'mouse',
      code: MouseCodes.X,
      callback: (value: number) => {
        const yawDelta = -value * 0.001;
        const up = camera.up.clone().normalize();
        camera.rotateOnWorldAxis(up, yawDelta);
      }
    });

    engine.inputManager.bindAction({
      name: 'ZoomCamera',
      type: 'mouse',
      code: MouseCodes.WHEEL_UP,
      callback: (value: number) => {
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);                 // world forward vector
        camera.position.addScaledVector(dir, -value * 0.1); // move forward on wheel up
      }
    });

    engine.inputManager.bindAction({
      name: 'ZoomOutCamera',
      type: 'mouse',
      code: MouseCodes.WHEEL_DOWN,
      callback: (value: number) => {
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        camera.position.addScaledVector(dir, value * 0.1); // move back on wheel down
      }
    });
  }
}
