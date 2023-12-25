import { firestoreDB } from '../services/db';
import type {
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { gameDataCollectionName } from '../appConfig';

interface INews {
  news: string;
  forInsider: boolean;
}

interface IStock {
  name: string;
  bpc: number;
}

export class GameData {
  constructor(
    public news: INews[],
    public stocks: IStock[],
  ) {}
}

const gameDataConverter = {
  toFirestore(gameData: GameData): DocumentData {
    return {
      news: gameData.news,
      stocks: gameData.stocks,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<GameData>): GameData {
    return snapshot.data();
  },
};

export const gameDataCollectionRef = firestoreDB.collection(
  gameDataCollectionName,
);
export const convertedGameDataCollectionRef = firestoreDB
  .collection(gameDataCollectionName)
  .withConverter(gameDataConverter);
