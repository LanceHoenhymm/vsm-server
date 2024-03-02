import type {
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore';

export interface IStockCurrentData {
  value: number;
  volTraded: number;
}

export const StockCurrentConverter: FirestoreDataConverter<IStockCurrentData> =
  {
    toFirestore(stock: IStockCurrentData): DocumentData {
      return stock;
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot<IStockCurrentData>,
    ): IStockCurrentData {
      return snapshot.data();
    },
  };
