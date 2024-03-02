import EventEmitter from 'events';
import { getUnixTime } from '../common/utils';
import {
  type IGameState,
  gameInitRoundNo,
  gameInitStage,
  gameDefaultFirstStage,
  gameStages,
  type StageEnum,
  gameStageDurations,
  gameRunTime,
  gameInitDelay,
} from '../common/game-config';
import { registerGameRoundHandler } from './handlers/game-round-handlers';
import { Server } from 'socket.io';

export const gameEmitter = new EventEmitter();

let roundChanged: boolean = true;

const state: IGameState = {
  roundNo: gameInitRoundNo,
  stage: gameInitStage,
};

function getNextStage(currentStage: StageEnum) {
  const currentIndex = gameStages.indexOf(currentStage);
  const nextStage = (currentIndex + 1) % gameStages.length;
  return gameStages[nextStage];
}

function incrementStage() {
  roundChanged = false;
  state.stage = getNextStage(state.stage);
  if (state.stage === gameDefaultFirstStage) {
    state.roundNo++;
    roundChanged = true;
  }
}

export function getState() {
  return { ...state } as const;
}

export function initGame(io: Server) {
  const endTime = getUnixTime() + gameInitDelay + gameRunTime;
  registerGameRoundHandler(gameEmitter, getState, io);

  function gameLoop() {
    const now = getUnixTime();

    if (now > endTime) gameEmitter.emit('game:end');
    else {
      const currentStage = state.stage;
      const stageDuration = gameStageDurations[currentStage];

      gameEmitter.emit('game:stage:update', getState());
      gameEmitter.emit(`game:stage:${state.stage}`);
      if (roundChanged) gameEmitter.emit(`game:round`);

      setTimeout(() => {
        incrementStage();
        gameLoop();
      }, stageDuration * 1000);
    }
  }

  setTimeout(() => {
    gameEmitter.emit('game:on');
    state.roundNo = 1;
    state.stage = gameDefaultFirstStage;
    gameLoop();
  }, gameInitDelay * 1000);
}
