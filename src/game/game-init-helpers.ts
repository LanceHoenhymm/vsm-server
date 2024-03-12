import {
  stocksCurrentColName,
  stocksDataColName,
} from '../common/app-config.js';
import {
  StockCurrentConverter,
  StockDataConverter,
} from '../converters/index.js';
import { getFirestoreDb } from '../services/firebase.js';

export async function initEnlistStocks() {
  const firestore = getFirestoreDb();
  const stockCurrColRef = firestore
    .collection(stocksCurrentColName)
    .withConverter(StockCurrentConverter);
  const stockDataDoc = await firestore
    .collection(stocksDataColName)
    .withConverter(StockDataConverter)
    .doc('R1')
    .get();

  if (stockDataDoc.exists) return;
  const stockData = stockDataDoc.data();
  const batch = firestore.batch();

  for (const stock in stockData) {
    batch.create(stockCurrColRef.doc(stock), {
      value: stockData[stock].initialValue,
      volTraded: 0,
    });
  }

  await batch.commit();
}
