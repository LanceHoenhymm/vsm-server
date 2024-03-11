import type {
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore';

export interface IStockData {
  [name: string]: {
    bpc: number;
    initialValue: number;
    freebies: number;
  };
}

export const StockDataConverter: FirestoreDataConverter<IStockData> = {
  toFirestore(stockData: IStockData): DocumentData {
    return stockData;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<IStockData>): IStockData {
    return snapshot.data();
  },
};
