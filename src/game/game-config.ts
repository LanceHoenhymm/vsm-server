const PossibleStage = ['TRADING_STAGE', 'CALCULATION_STAGE'] as const;

type KPossibleStage = (typeof PossibleStage)[number];

const startingAmount = 1000;
const startingValuation = 0;
const startingDebt = 0;
const initialGameRoundNo = 0;
const initialGameStage: KPossibleStage = 'TRADING_STAGE';

const defaultFirstStage: KPossibleStage = 'TRADING_STAGE';

const stageDurations: Record<KPossibleStage, number> = {
  TRADING_STAGE: 5 * 60 * 1000, // 5 minutes
  CALCULATION_STAGE: 1 * 60 * 1000, // 1 minute
};

const gameRunTime = 3 * 60 * 60 * 1000; // 3 hours

export {
  startingAmount,
  startingValuation,
  startingDebt,
  initialGameStage,
  initialGameRoundNo,
  KPossibleStage,
  PossibleStage,
  defaultFirstStage,
  stageDurations,
  gameRunTime,
};
