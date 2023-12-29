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

function getNextStage(currentStage: StageEnum) {
  const currentIndex = Stages.indexOf(currentStage);
  const nextStage = (currentIndex + 1) % Stages.length;
  return Stages[nextStage];
}

export function getGameLoop(emitter: EventEmitter, startTime: number) {
  const endTime = startTime + gameRunTime;
  let roundChanged: boolean = true;

  const state = {
    roundNo: initialGameRoundNo,
    stage: initialGameStage,
  };

  function incrementStage() {
    roundChanged = false;
    state.stage = getNextStage(state.stage);
    if (state.stage === defaultFirstStage) {
      state.roundNo++;
      roundChanged = true;
    }
  }

  function getState() {
    return { ...state } as const;
  }

  function gameLoop() {
    const now = getUnixTime();

    if (now > endTime) emitter.emit('game:end');
    else {
      const currentStage = state.stage;
      const stageDuration = stageDurations[currentStage];

      emitter.emit(`game:stage:${state.stage}`);
      if (roundChanged) emitter.emit(`game:round`);

      setTimeout(() => {
        incrementStage();
        gameLoop();
      }, stageDuration * 1000);
    }
  }

  return {
    getState,
    gameLoop,
  };
}
