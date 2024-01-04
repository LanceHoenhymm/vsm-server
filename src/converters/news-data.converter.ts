import type {
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore';

type NewsId = `${'IN' | 'N'}${number}`;
interface IGameData {
  [id: NewsId]: {
    news: string;
    forInsider: boolean;
  };
}

export const NewsDataConverter: FirestoreDataConverter<IGameData> = {
  toFirestore(gameData: IGameData): DocumentData {
    return gameData;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<IGameData>): IGameData {
    return snapshot.data();
  },
};
