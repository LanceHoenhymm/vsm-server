import EventEmitter from 'events';
import { gameCLOSE, gameOFF, gameON, gameOPEN } from './game.events';

export const gameEmitter = new EventEmitter();

gameEmitter.on(gameON, () => {});
gameEmitter.on(gameOPEN, () => {});
gameEmitter.on(gameCLOSE, () => {});
gameEmitter.on(gameOFF, () => {});
