import type { Server } from 'socket.io';
import { gameEmitter } from './game';
import { gameON, gameOFF, gameOPEN, gameCLOSE } from './game.events';

export function registerGameGateway(io: Server) {
  gameEmitter.on(gameON, () => {
    io.emit('game:on');
  });
  gameEmitter.on(gameCLOSE, () => {
    io.emit('game:stage:CALCULATION_STAGE');
  });
  gameEmitter.on(gameOPEN, () => {
    io.emit('game:stage:TRADING_STAGE');
  });
  gameEmitter.on(gameOFF, () => {
    io.emit('game:end');
  });
}
