import { config } from 'dotenv';
config();

const serviceAccountConfig = {
  projectId: process.env.PROJECT_ID,
  clientEmail: process.env.CLIENT_EMAIL,
  privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const userAccountColName = 'users_test';
const newsDataColName = 'game_data_test';
const stocksDataColName = 'stocks_data_test';
const playerDataColName = 'player_data_test';
const playerPortColName = 'player_port_test';
const stocksCurrentColName = 'stocks_curr_test';
const transactionsColName = 'transactions_test';

export {
  serviceAccountConfig,
  newsDataColName,
  stocksDataColName,
  userAccountColName,
  playerDataColName,
  playerPortColName,
  stocksCurrentColName,
  transactionsColName,
};
