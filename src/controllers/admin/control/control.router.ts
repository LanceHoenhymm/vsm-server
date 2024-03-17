import { Router } from 'express';
import {
  startGameHandler,
  startRoundHandler,
  terminateGameHandler,
} from './control.controller';

export const controlRouter = Router();

controlRouter.post('/start-game', startGameHandler);
controlRouter.post('/start-round', startRoundHandler);
controlRouter.post('/terminate-game', terminateGameHandler);
