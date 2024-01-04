import type {
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore';

interface IGameData {
  news: Array<{
    news: string;
    forInsider: boolean;
  }>;
  stocks: Array<{
    name: string;
    bpc: number;
    maxVol: number;
  }>;
}

export const GameDataConverter: FirestoreDataConverter<IGameData> = {
  toFirestore(gameData: IGameData): DocumentData {
    return gameData;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<IGameData>): IGameData {
    return snapshot.data();
  },
};
