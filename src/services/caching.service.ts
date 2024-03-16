import NodeCache from 'node-cache';
import { roundDuration } from '../game/game.config.js';

export const cache = new NodeCache({
  useClones: false,
});
