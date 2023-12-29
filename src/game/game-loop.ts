import EventEmitter from 'events';
import { getUnixTime } from '../common/utils';
import { gameRunTime, stageDurations } from './game-config';
import { getState, incrementStage } from './game-state';

export function getGameLoop(emitter: EventEmitter) {
  const endTime = getUnixTime() + gameRunTime;
  return function gameLoop() {
    const now = getUnixTime();

    if (endTime - now < 0) {
      emitter.emit('game:end');
    } else {
      const currentStage = getState().stage;
      const stageDuration = stageDurations[currentStage];
      emitter.emit(`game:stage:${currentStage}`);
      setTimeout(() => {
        incrementStage();
        gameLoop();
      }, stageDuration);
    }
  };
}
