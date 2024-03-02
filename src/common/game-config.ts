const gameStages = ['TRADING_STAGE', 'CALCULATION_STAGE'] as const;
type StageEnum = (typeof gameStages)[number];

interface IGameState {
  roundNo: number;
  stage: StageEnum;
}

const gameInitRoundNo = 0;
const gameInitStage: StageEnum = 'CALCULATION_STAGE';
const gameDefaultFirstStage: StageEnum = 'TRADING_STAGE';

// Time is in Seconds
const gameStageDurations: Record<StageEnum, number> = {
  TRADING_STAGE: 20 * 60, // 20 minutes
  CALCULATION_STAGE: 1 * 60, // 1 minute
};
const gameRunTime = 3 * 60 * 60; // 3 hours
const gameInitDelay = 10 * 60; // 10 minutes

const startingAmount = 1000;
const startingValuation = 0;

const muftMoneyAwarded = 10000;

export {
  startingAmount,
  startingValuation,
  gameInitStage,
  gameInitRoundNo,
  StageEnum,
  IGameState,
  gameStages,
  gameDefaultFirstStage,
  gameStageDurations,
  gameRunTime,
  gameInitDelay,
  muftMoneyAwarded,
};
