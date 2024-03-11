import { config } from 'dotenv';
config();

const port = process.env.PORT ?? 8080;
const allowedOrigin = process.env.ALLOWED_ORIGIN;

const serviceAccountConfig = {
  projectId: process.env.PROJECT_ID,
  clientEmail: process.env.CLIENT_EMAIL,
  privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const gameStateColName = 'game_state';
const newsDataColName = 'news_data';
const playerDataColName = 'player_data';
const stocksDataColName = 'stocks_data';
const stocksCurrentColName = 'stocks_curr';
const transactionsColName = 'transactions';
const usersColName = 'users';

const gameStateDocName = 'gameState';

const cacheTime = process.env.CACHE_TIME ?? '5 minutes';

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
