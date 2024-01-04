import {
  stocksCurrentColName,
  stocksDataColName,
} from '../../common/app-config';
import { StockCurrentConverter, StockDataConverter } from '../../converters';
import { getFirestoreDb } from '../../services/firebase';

export async function createStocksCurrentCol() {
  const firestore = getFirestoreDb();
  const stockDataCol = firestore
    .collection(stocksDataColName)
    .withConverter(StockDataConverter);
  const stockCurrentCol = firestore
    .collection(stocksCurrentColName)
    .withConverter(StockCurrentConverter);
  const batchWrite = firestore.batch();
  const roundOneStockData = (await stockDataCol.doc('R1').get()).data()!;

  for (const [stock, data] of Object.entries(roundOneStockData)) {
    batchWrite.create(stockCurrentCol.doc(stock), {
      value: data.initialValue,
      maxVolTrad: data.maxVolTrad,
      volTraded: 0,
    });
  }

  await batchWrite.commit();
}
