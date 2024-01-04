import type {
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore';

export interface ITransaction {
  teamId: string;
  stock: string;
  volume: number;
  amount: number;
  type: 'buy' | 'sell';
}

export const TransactionsConverter: FirestoreDataConverter<ITransaction> = {
  toFirestore(transaction: ITransaction): DocumentData {
    return transaction;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<ITransaction>): ITransaction {
    return snapshot.data();
  },
};
