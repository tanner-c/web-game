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

  public toJSON() {
    return this.components.map(component => component.toJSON());
  }

  public loadComponentsFromJSON(jsonArray: any[]) {
    for (const json of jsonArray) {
      Component.fromJSON(json);
    }
  }

  public clear() {
    for (const component of this.components) {
      component.dispose();
    }

    this.components = [];
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

  // Serialize the component to JSON
  // This only serializes basic information; custom data should be added in subclasses
  public toJSON() {
    return {
      type: (this as any).type ?? this.constructor.name,
      object3D: this.object3D.uuid,
    };
  }

  // Deserialize a component from JSON
  // FIX: This restores components, but FreeCamComponent logic fails to rebind input actions
  // FIX: Anonymous components (base Component class) cannot be restored properly
  public static fromJSON(json: any): Component {
    // Get type from JSON, default to 'Component' if not present

    const type = json.type || 'Component';

    // Find the object3D by UUID in the scene
    const object3D = Engine.instance.scene.getObjectByProperty('uuid', json.object3D);

    if (!object3D) {
      throw new Error(`Object3D with UUID ${json.object3D} not found in scene`);
    }

    // Find the component class by type
    const componentClass = (globalThis as any)[type] || Component;
    return new componentClass(object3D);
  }

  public dispose() {
    Engine.instance.componentManager.removeComponent(this);


    this.dispatchEvent({ type: 'disposed', target: this });

    // Unbind any input actions bound by this component
    for (const action of this.boundInputActions) {
      Engine.instance.inputManager.unbindAction(`${action.type}:${action.code}`);
    }

    this.object3D.userData.components = this.object3D.userData.components.filter((comp: Component) => comp !== this);

    this.boundInputActions = [];

    this.dispatchEvent({ type: 'disposed', target: this });
  }
}