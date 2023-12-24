import admin from 'firebase-admin';
(await import('dotenv')).config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  databaseURL:
    'https://vsm-2024-test-default-rtdb.asia-southeast1.firebasedatabase.app',
});

const firestoreDB = admin.firestore();
const realTimeDB = admin.database();

export { firestoreDB, realTimeDB };
