import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getDatabase, type Database } from 'firebase-admin/database';
import { rtDatabaseURL, serviceAccountConfig } from '../appConfig';

let firestoreDB: Firestore | null = null;
let realTimeDB: Database | null = null;

function initializeFirebase() {
  const adminApp = initializeApp({
    credential: cert(serviceAccountConfig),
    databaseURL: rtDatabaseURL,
  });

  firestoreDB = getFirestore(adminApp);
  realTimeDB = getDatabase(adminApp);
}

function getFirestoreDb() {
  if (!firestoreDB) initializeFirebase();
  return firestoreDB!;
}

function getRealTimeDb() {
  if (!realTimeDB) initializeFirebase();
  return realTimeDB!;
}

export { getFirestoreDb, getRealTimeDb };
