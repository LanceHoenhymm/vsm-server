import { config } from 'dotenv';
config();

const serviceAccountConfig = {
  projectId: process.env.PROJECT_ID,
  clientEmail: process.env.CLIENT_EMAIL,
  privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const rtDatabaseURL =
  'https://vsm-2024-test-default-rtdb.asia-southeast1.firebasedatabase.app';

const gameDataCollectionName = 'game_data_test';
const userCollectionName = 'users_test';

const gameStateRefName = 'game_state_test';
const userAccountRefName = 'user_acc_test';
const userPortfolioRefName = 'user_port_test';
const userStatusRefName = 'status_test';
const userHistoryRefName = 'user_history_test';
const stocksDataRefName = 'stocks_test';
const stocksDataHistoryRefName = 'stocks_history_test';
const transactionsRefName = 'transactions_test';

export {
  serviceAccountConfig,
  rtDatabaseURL,
  gameDataCollectionName,
  userCollectionName,
  gameStateRefName,
  userAccountRefName,
  userPortfolioRefName,
  userStatusRefName,
  userHistoryRefName,
  stocksDataRefName,
  stocksDataHistoryRefName,
  transactionsRefName,
};
