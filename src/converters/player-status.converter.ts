import type {
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore';

interface IPlayerStatus {}

export const PlayerStatusConverter: FirestoreDataConverter<IPlayerStatus> = {
  toFirestore(playerData: IPlayerStatus): DocumentData {
    return playerData;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<IPlayerStatus>): IPlayerStatus {
    return snapshot.data();
  },
};
