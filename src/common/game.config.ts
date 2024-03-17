import { config } from 'dotenv';
config();

const envMaxRounds = Number(process.env.MAX_GAME_ROUNDS);
export const maxGameRounds = isNaN(envMaxRounds) ? 0 : envMaxRounds;

const envRoundDuration = Number(process.env.ROUND_DURATION);
export const roundDuration =
  (isNaN(envRoundDuration) ? 0 : envRoundDuration) * 60 * 1000;

export const initialBankBalance = 1000000;
