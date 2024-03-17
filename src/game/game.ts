import { IGameState } from '@/types';
import EventEmitter from 'events';
import { logger } from '@services/index';
import { initializeDatabase } from '@game/helpers/initializers';
import {
  updatePlayerPortfolio,
  updateStocks,
} from '@game/helpers/sheduled-task';
import { gameCLOSE, gameOFF, gameON, gameOPEN } from '@game/game.events';
import { maxGameRounds, roundDuration } from '@common/game.config';

export const gameEmitter = new EventEmitter();

const gameState: IGameState = {
  roundNo: 0,
  stage: 'INVALID',
};

export function getGameState() {
  return { ...gameState } as const;
}

let timeoutId: NodeJS.Timeout;

export function startGame() {
  gameState.stage = 'ON';
  gameEmitter.emit(gameON);
}

export function startRound() {
  if (gameState.roundNo === 0) {
    gameState.roundNo = 1;
  } else {
    const nextRound = gameState.roundNo + 1;
    if (nextRound >= maxGameRounds) {
      logger.info('Max Game Rounds Reached');
      endGame();
      return;
    }
  }
  gameState.stage = 'OPEN';
  gameEmitter.emit(gameOPEN);
}

gameEmitter.on(gameON, async () => {
  try {
    logger.info('Initializing Database');
    await initializeDatabase();
    logger.info('Database Initialized: Server Open to Login Requests');

    logger.info('Game is ON');
  } catch (error) {
    logger.error('Failed to initialize database: ', error);
  }
});

gameEmitter.on(gameOPEN, () => {
  logger.info(`Starting Round ${gameState.roundNo}...`);
  timeoutId = setTimeout(() => {
    gameState.stage = 'CLOSE';
    gameEmitter.emit(gameCLOSE);
  }, roundDuration);
});

gameEmitter.on(gameCLOSE, async () => {
  logger.info('Game is CLOSED');
  try {
    logger.info('Updating Stocks...');
    await updateStocks(gameState);
    logger.info('Stocks Updated.');

    logger.info('Updating Player Portfolios...');
    await updatePlayerPortfolio();
    logger.info('Updated Player Portfolios.');

    logger.info('Game Ready for Next Round');
  } catch (error) {
    logger.error('Failed to update: ', error);
  }
});

export function endGame() {
  gameState.stage = 'OFF';
  clearTimeout(timeoutId);
  gameEmitter.emit(gameOFF);
}

gameEmitter.on(gameOFF, () => {
  logger.info('Game is OFF');
});
