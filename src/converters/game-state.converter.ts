import type {
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore';
import type { IGameState } from '../types';

export const GameStateConverter: FirestoreDataConverter<IGameState> = {
  toFirestore(gameData: IGameState): DocumentData {
    return gameData;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<IGameState>): IGameState {
    return snapshot.data();
  },
};
