import type {
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

interface INews {
  news: string;
  forInsider: boolean;
}

interface IStock {
  name: string;
  bpc: number;
}

interface IGameData {
  news: INews[];
  stocks: IStock[];
}

export const gameDataConverter = {
  toFirestore(gameData: IGameData): DocumentData {
    return gameData;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<IGameData>): IGameData {
    return snapshot.data();
  },
};
