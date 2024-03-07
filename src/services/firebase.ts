import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { serviceAccountConfig } from '../common/app-config.js';

let firestoreDB: Firestore | null = null;

function initializeFirebase() {
  const adminApp = initializeApp({
    credential: cert(serviceAccountConfig),
  });

  firestoreDB = getFirestore(adminApp);
}

function getFirestoreDb() {
  if (!firestoreDB) initializeFirebase();
  return firestoreDB!;
}

export { getFirestoreDb };
