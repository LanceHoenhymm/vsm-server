import EventEmitter from 'events';

function onRoundChange() {
  console.log('every round');
}

function onCalculationStage() {
  console.log('calculation stage');
}

export function registerGameRoundHandler(emitter: EventEmitter) {
  emitter.on('game:stage:CALCULATION_STAGE', onCalculationStage);
  emitter.on('game:round', onRoundChange);
}
