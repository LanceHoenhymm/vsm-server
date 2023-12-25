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

export {
  gameDataCollectionName,
  userCollectionName,
  serviceAccountConfig,
  rtDatabaseURL,
};
