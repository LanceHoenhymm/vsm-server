import type {
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore';

export interface INewsData {
  [id: string]: {
    news: string;
    forInsider: boolean;
  };
}

export const NewsDataConverter: FirestoreDataConverter<INewsData> = {
  toFirestore(gameData: INewsData): DocumentData {
    return gameData;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<INewsData>): INewsData {
    return snapshot.data();
  },
};
