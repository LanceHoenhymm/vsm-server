enum PossibleStage {
  TRADING_STAGE = 0,
  CALCULATION_STAGE,
}

const startingAmount = 1000;
const startingValuation = 0;
const startingDebt = 0;
const initialGameRoundNo = 0;
const initialGameStage = PossibleStage.TRADING_STAGE;

const defaultFirstStage = PossibleStage.TRADING_STAGE;

export {
  startingAmount,
  startingValuation,
  startingDebt,
  initialGameStage,
  initialGameRoundNo,
  PossibleStage,
  defaultFirstStage,
};
