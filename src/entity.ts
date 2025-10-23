import * as THREE from 'three/webgpu';

export class EntityManager {
  private entities: Entity[] = [];

  public addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  public removeEntity(entity: Entity) {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
    }
  }

  public updateEntities() {
    for (const entity of this.entities) {
      entity.update();
    }
  }
}

/**
 * Wrapper class for ThreeJS objects, lights, cameras, etc, allowing for logic and state management.
 */
export class Entity {
  public object3D: THREE.Object3D;
  public update: () => void;
  private scene: THREE.Scene;


  constructor(object3D: THREE.Object3D, scene: THREE.Scene, update: () => void = () => {}) {
    this.object3D = object3D;
    this.update = update;
    this.scene = scene;
    this.scene.add(this.object3D);
  }

  public toJSON() {
    return this.object3D.toJSON();
  }

  public dispose() {
    this.scene.remove(this.object3D);
  }
}