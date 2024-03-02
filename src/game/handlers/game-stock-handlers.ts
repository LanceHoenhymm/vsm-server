import { FieldValue } from 'firebase-admin/firestore';
import {
  playerDataColName,
  stocksCurrentColName,
  stocksDataColName,
  transactionsColName,
} from '../../common/app-config';
import {
  type IPlayerData,
  type IStockCurrentData,
  type IStockData,
  PlayerDataConverter,
  StockCurrentConverter,
  StockDataConverter,
  TransactionsConverter,
} from '../../converters';
import { getFirestoreDb } from '../../services/firebase';
import { getState } from '../game';

export function buyStock(teamId: string, stock: string, volume: number) {
  const firestore = getFirestoreDb();
  const playerDoc = firestore
    .collection(playerDataColName)
    .withConverter(PlayerDataConverter)
    .doc(teamId);
  const stockCurrDoc = firestore
    .collection(stocksCurrentColName)
    .withConverter(StockCurrentConverter)
    .doc(stock);
  const stockDataDoc = firestore
    .collection(stocksDataColName)
    .withConverter(StockDataConverter)
    .doc(`R${getState().roundNo}`);
  const transactionDoc = firestore
    .collection(transactionsColName)
    .withConverter(TransactionsConverter)
    .doc();

  return firestore.runTransaction(async (t) => {
    const [stockCurrData, playerData, stockData] = (
      await Promise.all([
        t.get(stockCurrDoc),
        t.get(playerDoc),
        t.get(stockDataDoc),
      ])
    ).map((d) => d.data()) as [IStockCurrentData, IPlayerData, IStockData];
    const amount = volume * stockCurrData.value;

    if (amount > playerData.balance) {
      throw new Error('Insufficient Balance');
    } else if (stockCurrData.volTraded >= stockData[stock].maxVolTrad) {
      throw new Error('Max Transaction Reached');
    } else {
      t.update(stockCurrDoc, { volTraded: FieldValue.increment(volume) });
      t.update(playerDoc, {
        balance: FieldValue.increment(-amount),
        valuation: FieldValue.increment(amount),
        [`portfolio.${stock}`]: { volume: FieldValue.increment(volume) },
      });
      t.set(transactionDoc, {
        teamId,
        stock,
        volume,
        amount,
        type: 'buy',
        round: getState().roundNo,
      });
    }
  });
}

export function sellStock(teamId: string, stock: string, volume: number) {
  const firestore = getFirestoreDb();
  const playerDoc = firestore
    .collection(playerDataColName)
    .withConverter(PlayerDataConverter)
    .doc(teamId);
  const stockDoc = firestore
    .collection(stocksCurrentColName)
    .withConverter(StockCurrentConverter)
    .doc(stock);
  const transactionDoc = firestore
    .collection(transactionsColName)
    .withConverter(TransactionsConverter)
    .doc();

  return firestore.runTransaction(async (t) => {
    const [stockData, playerData] = (
      await Promise.all([t.get(stockDoc), t.get(playerDoc)])
    ).map((d) => d.data()) as [IStockCurrentData, IPlayerData];
    const amount = stockData.value * volume;

    if (
      !Object.prototype.hasOwnProperty.call(playerData, stock) ||
      playerData.portfolio[stock].volume < volume
    ) {
      throw new Error(`Insufficient Stocks`);
    } else {
      t.update(playerDoc, {
        balance: FieldValue.increment(amount),
        valuation: FieldValue.increment(-amount),
        [`portfolio.${stock}`]: { volume: FieldValue.increment(-volume) },
      });
      t.set(transactionDoc, {
        teamId,
        stock,
        volume,
        amount,
        type: 'sell',
        round: getState().roundNo,
      });
    }
  });
}
