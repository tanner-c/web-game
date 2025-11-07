import { Component } from './component';
import { Engine } from './engine';
import * as THREE from 'three/webgpu';

class PlayerComponent extends Component {
    constructor(object3D: THREE.Object3D) {
        super(object3D);

        this.bindAction({
            name: 'moveForward',
            type: 'keyboard',
            code: 'KeyW',
            callback: (value: number) => {
                this.object3D.position.z -= value * 0.1;
            }
        });

        this.bindAction({
            name: 'moveBackward',
            type: 'keyboard',
            code: 'KeyS',
            callback: (value: number) => {
                this.object3D.position.z += value * 0.1;
            }
        });


        this.bindAction({
            name: 'moveLeft',
            type: 'keyboard',
            code: 'KeyA',
            callback: (value: number) => {
                this.object3D.position.x -= value * 0.1;
            }
        });

        this.bindAction({
            name: 'moveRight',
            type: 'keyboard',
            code: 'KeyD',
            callback: (value: number) => {
                this.object3D.position.x += value * 0.1;
            }
        });
    }
}

export function initializeGame(engine: Engine) {
    const { scene, camera } = engine;

    // Create floor
    const floorGeometry = new THREE.BoxGeometry(50, 1, 50);
    const floorMaterial = new THREE.MeshPhysicalMaterial({
        color: '#df1010ff',
        roughness: 0.5,
        metalness: 0.5,
    });

    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.position.y = -0.5;
    scene.add(floorMesh);

    // Create empty player object

    const player = new THREE.Object3D();
    player.add(camera);
    camera.position.set(0, 1.6, 0);

    player.position.y = 1;
    scene.add(player);

    new PlayerComponent(player);


    // Initialize light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

}