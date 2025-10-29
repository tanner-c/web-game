import * as THREE from 'three/webgpu';
import { Engine } from './engine';
import { InputAction } from './input';


/**
 * ComponentEventMap interface for Component events.
 */
export interface ComponentEventMap extends THREE.Event {
  disposed: { type: 'disposed'; target: Component };
}

/**
 * Manages all components in the engine, updating them each frame.
 */
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

  public update() {
    for (const component of this.components) {
      component.update();
    }
  }
}

/**
 * Component class, similar to what you might see in Unity. This binds to Three.Object3D instances via .userData.
 * Components can have update functions that are called each frame by the ComponentManager.
 * They can also bind input actions to the engine's InputManager, which are tracked and unbound when the component is disposed.
 * 
 * @events disposed - Dispatched when the component is disposed.
 */
export class Component extends THREE.EventDispatcher<ComponentEventMap> {
  public object3D: THREE.Object3D;
  public update: () => void;

  private boundInputActions: InputAction[] = [];


  constructor(object3D: THREE.Object3D, update: () => void = () => {}) {
    super();

    this.object3D = object3D;
    this.update = update;

    // If object3D has no components array, initialize it
    if (!this.object3D.userData.components) {
      this.object3D.userData.components = [];
    }

    Engine.instance.componentManager.addComponent(this);
    this.object3D.userData.components.push(this);

    this.object3D.addEventListener('removed' , () => {
      this.dispose();
    });
  }

  // This method allows components to bind input actions to the engine's input manager
  // The bound actions are tracked so they can be unbound when the component is disposed
  public bindAction(action: InputAction) {
    Engine.instance.inputManager.bindAction(action);
    this.boundInputActions.push(action);
  }

  public toJSON() {
    return this.object3D.toJSON();
  }

  public dispose() {
    Engine.instance.componentManager.removeComponent(this);


    this.dispatchEvent({ type: 'disposed', target: this });

    // Unbind any input actions bound by this component
    for (const action of this.boundInputActions) {
      Engine.instance.inputManager.unbindAction(action.name);
    }

    this.object3D.userData.components = this.object3D.userData.components.filter((comp: Component) => comp !== this);

    this.boundInputActions = [];

    this.dispatchEvent({ type: 'disposed', target: this });
  }
}