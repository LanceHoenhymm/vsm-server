import { firestoreDB } from '../services/db';
import type {
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { gameDataCollectionName } from '../appConfig';

export class News {
  constructor(
    public news: string,
    public forInsider: boolean,
  ) {}
}

export class Stock {
  constructor(
    public name: string,
    public bpc: number,
  ) {}
}

export class GameData {
  constructor(
    public news: News[],
    public stocks: Stock[],
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
