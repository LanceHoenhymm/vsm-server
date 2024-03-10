import { stocksCurrentColName, stocksDataColName } from '../common/app-config';
import { StockCurrentConverter, StockDataConverter } from '../converters';
import { getFirestoreDb } from '../services/firebase';

export async function initEnlistStocks() {
  const firestore = getFirestoreDb();
  const stockCurrColRef = firestore
    .collection(stocksCurrentColName)
    .withConverter(StockCurrentConverter);
  const stockData = (
    await firestore
      .collection(stocksDataColName)
      .withConverter(StockDataConverter)
      .doc('R1')
      .get()
  ).data();
  const batch = firestore.batch();

  for (const stock in stockData) {
    batch.create(stockCurrColRef.doc(stock), {
      value: stockData[stock].initialValue,
      volTraded: 0,
    });
  }

  await batch.commit();
}
