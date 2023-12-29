import {
  PossibleStage,
  initialGameRoundNo,
  initialGameStage,
  defaultFirstStage,
} from './game-config';

interface IState {
  roundNo: number;
  stage: PossibleStage;
}

let state: IState = Object.freeze({
  roundNo: initialGameRoundNo,
  stage: initialGameStage,
});

export function changeStage(nxtStage: PossibleStage) {
  const newState: IState = Object.freeze({
    roundNo: state.roundNo,
    stage: nxtStage,
  });
  state = newState;
}

export function incrementRound() {
  const newState: IState = Object.freeze({
    roundNo: state.roundNo + 1,
    stage: defaultFirstStage,
  });
  state = newState;
}

export function getState() {
  return state;
}
