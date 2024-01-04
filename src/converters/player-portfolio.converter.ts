import type {
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore';

export interface IPlayerPortfolio {
  [name: string]: {
    volume: number;
    totalValue: number;
  };
}

export const PlayerPortfolioConverter: FirestoreDataConverter<IPlayerPortfolio> =
  {
    toFirestore(playerData: IPlayerPortfolio): DocumentData {
      return playerData;
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot<IPlayerPortfolio>,
    ): IPlayerPortfolio {
      return snapshot.data();
    },
  };
