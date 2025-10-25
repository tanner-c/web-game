import * as THREE from 'three/webgpu';
import { Engine } from './engine';

export class ComponentManager {
  private components: Component[] = [];

  public addComponent(component: Component) {
    this.components.push(component);
  }

  public removeComponent(component: Component) {
    const index = this.components.indexOf(component);
    if (index !== -1) {
      this.components.splice(index, 1);
    }
  }

  public updateComponents() {
    for (const entity of this.components) {
      entity.update();
    }
  }
}

/**
 * Wrapper class for ThreeJS objects, lights, cameras, etc, allowing for logic and state management.
 */
export class Component {
  public object3D: THREE.Object3D;
  public update: () => void;


  constructor(object3D: THREE.Object3D, update: () => void = () => {}) {
    this.object3D = object3D;
    this.update = update;

    // If object3D has no components array, initialize it
    if (!this.object3D.userData.components) {
      this.object3D.userData.components = [];
    }

    Engine.instance.componentManager.addComponent(this);
    this.object3D.userData.components.push(this);

  }

  public toJSON() {
    return this.object3D.toJSON();
  }

  public dispose() {
    Engine.instance.componentManager.removeComponent(this);
  }
}