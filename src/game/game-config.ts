const Stages = ['TRADING_STAGE', 'CALCULATION_STAGE'] as const;
type StageEnum = (typeof Stages)[number];

const initialGameRoundNo = 1;
const initialGameStage: StageEnum = 'TRADING_STAGE';
const defaultFirstStage: StageEnum = 'TRADING_STAGE';

// Time is in Seconds
const stageDurations: Record<StageEnum, number> = {
  TRADING_STAGE: 5 * 60, // 5 minutes
  CALCULATION_STAGE: 1 * 60, // 1 minute
};
const gameRunTime = 3 * 60 * 60; // 3 hours

const startingAmount = 1000;
const startingValuation = 0;

const muftMoneyAwarded = 10000;

export {
  startingAmount,
  startingValuation,
  initialGameStage,
  initialGameRoundNo,
  StageEnum,
  Stages,
  defaultFirstStage,
  stageDurations,
  gameRunTime,
  muftMoneyAwarded,
};
