import { config } from 'dotenv';
config();

const tradingRoundDuration = Number(process.env.TRADING_ROUND_DURATION) * 60; // 20 minutes
const gameInitDelay = Number(process.env.GAME_INIT_DELAY) * 60; // 10 minute
const maxGameRounds = Number(process.env.MAX_GAME_ROUNDS);

const startingAmount = 1000;
const startingValuation = 0;

export {
  startingAmount,
  startingValuation,
  maxGameRounds,
  tradingRoundDuration,
  gameInitDelay,
};
