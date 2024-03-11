import EventEmitter from 'events';
import type { Server } from 'socket.io';
import {
  tradingRoundDuration,
  gameInitDelay,
  maxGameRounds,
} from '../common/game-config.js';
import type { IGameState } from '../types';
import {
  persistGameState,
  updateStockPrices,
  enlistNewStocks,
  updatePlayerPortfolioValuation,
  updatePlayerPowerCardStatus,
} from './handlers/game-round-handlers.js';
import { initEnlistStocks } from './game-init-helpers.js';

export const gameEmitter = new EventEmitter();

const state: IGameState = {
  roundNo: 0,
  stage: 'INVALID',
};

export function getState() {
  return { ...state } as const;
}

gameEmitter.on('game:on', async () => {
  await initEnlistStocks();
});

gameEmitter.on('game:stage:TRADING_STAGE', () => {
  void persistGameState(state);
  setTimeout(() => {
    state.stage = 'CALCULATION_STAGE';
    gameEmitter.emit('game:stage:CALCULATION_STAGE');
  }, tradingRoundDuration * 1000);
});

gameEmitter.on('game:stage:CALCULATION_STAGE', async () => {
  void persistGameState(state);
  try {
    await updateStockPrices(state);
    await updatePlayerPortfolioValuation();
    await updatePlayerPowerCardStatus();
    await enlistNewStocks(state);
  } catch (error) {
    console.log(error);
  }

  state.roundNo += 1;
  state.stage = 'TRADING_STAGE';

  if (state.roundNo >= maxGameRounds) {
    gameEmitter.emit('game:end');
    return;
  }
  gameEmitter.emit('game:stage:TRADING_STAGE');
});

gameEmitter.on('game:end', () => {
  state.stage = 'INVALID';
  state.roundNo -= 1;
});

export function registerGameNotifier(io: Server) {
  gameEmitter.on('game:on', () => {
    io.emit('game:on');
  });
  gameEmitter.on('game:stage:CALCULATION_STAGE', () => {
    io.emit('game:stage:CALCULATION_STAGE');
  });
  gameEmitter.on('game:stage:TRADING_STAGE', () => {
    io.emit('game:stage:TRADING_STAGE');
  });
  gameEmitter.on('game:end', () => {
    io.emit('game:end');
  });
}

export function game() {
  gameEmitter.emit('game:on');
  setTimeout(() => {
    state.roundNo = 1;
    state.stage = 'TRADING_STAGE';
    gameEmitter.emit('game:stage:TRADING_STAGE');
  }, gameInitDelay * 1000);
}
