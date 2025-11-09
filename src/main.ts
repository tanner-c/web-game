import { Engine } from './engine';
import { initializeGame } from './example-game';

const engine = new Engine(document.getElementById('root')!, {
  rendererParameters: {
    antialias: true
  }
});

initializeGame(engine);