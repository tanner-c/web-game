import { Engine } from './engine';
import { initializeGame } from './example-game';

const engine = new Engine({
  rendererParameters: {
    antialias: true
  }
});

initializeGame(engine);