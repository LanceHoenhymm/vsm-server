import { config } from 'dotenv';
config();

const serviceAccountConfig = {
  projectId: process.env.PROJECT_ID,
  clientEmail: process.env.CLIENT_EMAIL,
  privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

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
  playerDataColName,
  playerPortColName,
  stocksCurrentColName,
  transactionsColName,
};
