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

const gameStateRef = 'game_state_test';
const userAccountRef = 'user_acc_test';
const userPortfolioRef = 'user_port_test';
const userStatusRef = 'status_test';
const userHistoryRef = 'user_history_test';
const stocksDataRef = 'stocks_test';
const stocksDataHistoryRef = 'stocks_history_test';
const transactionsRef = 'transactions_test';

export {
  serviceAccountConfig,
  rtDatabaseURL,
  gameDataCollectionName,
  userCollectionName,
  gameStateRef,
  userAccountRef,
  userPortfolioRef,
  userStatusRef,
  userHistoryRef,
  stocksDataRef,
  stocksDataHistoryRef,
  transactionsRef,
};
