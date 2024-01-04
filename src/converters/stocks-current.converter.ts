import type {
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore';

interface IStockCurrentData {
  value: number;
  volume_traded: number;
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
