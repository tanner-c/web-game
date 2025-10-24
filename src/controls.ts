import { Engine, MouseCodes } from "./engine";
import * as THREE from "three";

export function setupControls() {
  const engine = Engine.instance;
  const { camera } = engine;

  engine.inputManager.bindAction({
    name: 'RotateCameraY',
    type: 'mouse',
    code: MouseCodes.Y,
    callback: (value: number) => {
      // pitch (local X). invert/scale as needed.
      const pitchDelta = -value * 0.001;
      camera.rotateX(pitchDelta);

      // clamp pitch to avoid flipping
      const limit = Math.PI / 2 - 0.01;
      camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x, -limit, limit);
    }
  });

  engine.inputManager.bindAction({
    name: 'RotateCameraX',
    type: 'mouse',
    code: MouseCodes.X,
    callback: (value: number) => {
      // yaw around world up (use camera.up to respect configured up vector)
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