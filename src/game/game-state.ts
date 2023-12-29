export enum PossibleStage {
  TRADING_STAGE = 0,
  CALCULATION_STAGE,
}

interface IState {
  roundNo: number;
  stage: PossibleStage;
}

let state: IState = Object.freeze({
  roundNo: 0,
  stage: PossibleStage.TRADING_STAGE,
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
    stage: PossibleStage.TRADING_STAGE,
  });
  state = newState;
}

export function getState() {
  return state;
}
