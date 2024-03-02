import { config } from 'dotenv';
config();

const serviceAccountConfig = {
  projectId: process.env.PROJECT_ID,
  clientEmail: process.env.CLIENT_EMAIL,
  privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const newsDataColName = 'news_data_test';
const playerDataColName = 'player_data_test';
const stocksDataColName = 'stocks_data_test';
const stocksCurrentColName = 'stocks_curr_test';
const transactionsColName = 'transactions_test';
const usersColName = 'users_test';

export {
  serviceAccountConfig,
  newsDataColName,
  stocksDataColName,
  usersColName,
  playerDataColName,
  stocksCurrentColName,
  transactionsColName,
};
