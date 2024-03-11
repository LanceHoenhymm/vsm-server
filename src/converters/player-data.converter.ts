import type {
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore';

export interface IPlayerData {
  balance: number;
  valuation: number;
  portfolio: {
    [name: string]: {
      volume: number;
    };
  };
}

export const PlayerDataConverter: FirestoreDataConverter<IPlayerData> = {
  toFirestore(playerData: IPlayerData): DocumentData {
    return playerData;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<IPlayerData>): IPlayerData {
    return snapshot.data();
  },
};
