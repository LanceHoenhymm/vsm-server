import type {
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
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

export class GameData implements IGameData {
  constructor(
    public news: INews[],
    public stocks: IStock[],
  ) {}

  static converter: FirestoreDataConverter<GameData> = {
    toFirestore(gameData: GameData): DocumentData {
      return {
        news: gameData.news,
        stocks: gameData.stocks,
      };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<IGameData>): GameData {
      const { news, stocks } = snapshot.data();
      return new GameData(news, stocks);
    },
  };
}
