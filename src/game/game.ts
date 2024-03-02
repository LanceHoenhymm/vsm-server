import EventEmitter from 'events';
import { getUnixTime } from '../common/utils';
import {
  gameRunTime,
  stageDurations,
  Stages,
  StageEnum,
  initialGameRoundNo,
  initialGameStage,
  defaultFirstStage,
} from './game-config';
import { registerGameRoundHandler } from './handlers/game-round-handlers';

export const gameEmitter = new EventEmitter();

let roundChanged: boolean = true;

const state = {
  roundNo: initialGameRoundNo,
  stage: initialGameStage,
};

function getNextStage(currentStage: StageEnum) {
  const currentIndex = Stages.indexOf(currentStage);
  const nextStage = (currentIndex + 1) % Stages.length;
  return Stages[nextStage];
}

function incrementStage() {
  roundChanged = false;
  state.stage = getNextStage(state.stage);
  if (state.stage === defaultFirstStage) {
    state.roundNo++;
    roundChanged = true;
  }
}

export function getState() {
  return { ...state } as const;
}

export function initGame(startTime: number) {
  const endTime = startTime + gameRunTime;
  registerGameRoundHandler(gameEmitter);

  function gameLoop() {
    const now = getUnixTime();

    if (now > endTime) gameEmitter.emit('game:end');
    else {
      const currentStage = state.stage;
      const stageDuration = stageDurations[currentStage];

      gameEmitter.emit(`game:stage:${state.stage}`);
      if (roundChanged) gameEmitter.emit(`game:round`);

      setTimeout(() => {
        incrementStage();
        gameLoop();
      }, stageDuration * 1000);
    }
  }

  gameLoop();
}
