import { config } from 'dotenv';
config();

const serviceAccountConfig = {
  projectId: process.env.PROJECT_ID,
  clientEmail: process.env.CLIENT_EMAIL,
  privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const rtDatabaseURL =
  'https://vsm-2024-test-default-rtdb.asia-southeast1.firebasedatabase.app';

const gameStateRefName = 'game_state_test';

const gameDataColName = 'game_data_test';
const userAccountColName = 'users_test';
const playerDataColName = 'user_acc_test';
const playerPortColName = 'user_port_test';
const playerStatColName = 'status_test';
const playerHistColName = 'user_history_test';
const stocksDataColName = 'stocks_test';
const stocksHistColName = 'stocks_history_test';
const transactionsColName = 'transactions_test';

export {
  serviceAccountConfig,
  rtDatabaseURL,
  gameDataColName,
  userAccountColName,
  gameStateRefName,
  playerDataColName,
  playerPortColName,
  playerStatColName,
  playerHistColName,
  stocksDataColName,
  stocksHistColName,
  transactionsColName,
};
