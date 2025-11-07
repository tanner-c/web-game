import * as THREE from 'three/webgpu';

export class Level {
    scene: THREE.Scene;

    constructor() {
        this.scene = new THREE.Scene();
    }
}