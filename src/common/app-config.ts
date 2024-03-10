import { config } from 'dotenv';
config();

const port = process.env.PORT ?? 8080;
const allowedOrigin = process.env.ALLOWED_ORIGIN;

const serviceAccountConfig = {
  projectId: process.env.PROJECT_ID,
  clientEmail: process.env.CLIENT_EMAIL,
  privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const gameStateColName = 'game_state_test';
const newsDataColName = 'news_data_test';
const playerDataColName = 'player_data_test';
const stocksDataColName = 'stocks_data_test';
const stocksCurrentColName = 'stocks_curr_test';
const transactionsColName = 'transactions_test';
const usersColName = 'users_test';

const gameStateDocName = 'gameState';

const cacheTime = '5 minutes';

export {
  port,
  allowedOrigin,
  serviceAccountConfig,
  gameStateColName,
  newsDataColName,
  stocksDataColName,
  playerDataColName,
  stocksCurrentColName,
  transactionsColName,
  usersColName,
  gameStateDocName,
  cacheTime,
};
