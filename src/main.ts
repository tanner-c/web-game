import * as THREE from 'three';
import { Engine } from './engine';
import { Component } from './component';
import { FreeCamComponent } from './camera';
import { initializeGame } from './example-game';

const engine = new Engine({
  rendererParameters: {
    antialias: true
  }
});

initializeGame(engine);