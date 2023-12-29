import type {
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore';

interface IPlayerHistory {}

export const PlayerHistoryConverter: FirestoreDataConverter<IPlayerHistory> = {
  toFirestore(playerData: IPlayerHistory): DocumentData {
    return playerData;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<IPlayerHistory>,
  ): IPlayerHistory {
    return snapshot.data();
  },
};
