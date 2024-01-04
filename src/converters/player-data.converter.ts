import type {
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore';

export interface IPlayerData {
  balance: number;
  valuation: number;
  total: number;
  powercards: {
    muft: 'unused' | 'active' | 'used';
    options: {
      status: 'unused' | 'active' | 'used';
      forStock: string | null;
      lockedPrice: number | null;
    };
    insider: 'unused' | 'used';
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
