import type {
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore';

interface IStockData {
  [name: string]: {
    bpc: number;
    maxVolTrad: number;
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
