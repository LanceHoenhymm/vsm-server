import {
  PossibleStage,
  KPossibleStage,
  initialGameRoundNo,
  initialGameStage,
  defaultFirstStage,
} from './game-config';

interface IState {
  roundNo: number;
  stage: KPossibleStage;
}

let state: IState = Object.freeze({
  roundNo: initialGameRoundNo,
  stage: initialGameStage,
});

function getNextStage(currentStage: KPossibleStage) {
  const currentIndex = PossibleStage.indexOf(currentStage);
  const nextStage = (currentIndex + 1) % PossibleStage.length;
  return PossibleStage[nextStage];
}

export function incrementStage() {
  const newStage = getNextStage(state.stage);
  let newRoundNo = state.roundNo;
  if (newStage === defaultFirstStage) newRoundNo++;

  state = Object.freeze({
    roundNo: newRoundNo,
    stage: newStage,
  });

  return state;
}

export function getState() {
  return state;
}
