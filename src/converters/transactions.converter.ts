import type {
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore';

interface ITransactions {
  teamId: string;
  stock: string;
  volume: number;
  amount: number;
}

export const TransactionsConverter: FirestoreDataConverter<ITransactions> = {
  toFirestore(transaction: ITransactions): DocumentData {
    return transaction;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<ITransactions>): ITransactions {
    return snapshot.data();
  },
};
