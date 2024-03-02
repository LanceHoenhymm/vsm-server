import { FieldValue } from 'firebase-admin/firestore';
import {
  playerDataColName,
  playerPortColName,
  stocksCurrentColName,
  transactionsColName,
} from '../../common/app-config';
import {
  IPlayerData,
  IStockCurrentData,
  IPlayerPortfolio,
  PlayerDataConverter,
  StockCurrentConverter,
  PlayerPortfolioConverter,
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
  const stockDoc = firestore
    .collection(stocksCurrentColName)
    .withConverter(StockCurrentConverter)
    .doc(stock);
  const portDoc = firestore
    .collection(playerPortColName)
    .withConverter(PlayerPortfolioConverter)
    .doc(teamId);
  const transactionDoc = firestore
    .collection(transactionsColName)
    .withConverter(TransactionsConverter)
    .doc();

  return firestore.runTransaction(async (t) => {
    const [stockData, playerData] = (
      await Promise.all([t.get(stockDoc), playerDoc.get()])
    ).map((d) => d.data()) as [IStockCurrentData, IPlayerData];
    const amount = volume * stockData.value;

    if (amount > playerData.balance) {
      throw new Error('Insufficient Balance');
    } else if (stockData.volTraded >= stockData.maxVolTrad) {
      throw new Error('Max Transaction Reached');
    } else {
      t.update(stockDoc, { volTraded: FieldValue.increment(volume) });
      t.update(playerDoc, {
        balance: FieldValue.increment(-amount),
        valuation: FieldValue.increment(amount),
      });
      t.set(
        portDoc,
        {
          [stock]: {
            volume: FieldValue.increment(volume),
            totalValue: FieldValue.increment(amount),
          },
        },
        { mergeFields: [`${stock}.amount`, `${stock}.totalValue`] },
      );
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
  const portDoc = firestore
    .collection(playerPortColName)
    .withConverter(PlayerPortfolioConverter)
    .doc(teamId);
  const transactionDoc = firestore
    .collection(transactionsColName)
    .withConverter(TransactionsConverter)
    .doc();

  return firestore.runTransaction(async (t) => {
    const [stockData, portData] = (
      await Promise.all([t.get(stockDoc), t.get(portDoc)])
    ).map((d) => d.data()) as [IStockCurrentData, IPlayerPortfolio];
    const amount = stockData.value * volume;

    if (
      !Object.prototype.hasOwnProperty.call(portData, stock) ||
      portData[stock].volume < volume
    ) {
      throw new Error(`Insufficient Stocks`);
    } else {
      t.update(playerDoc, {
        balance: FieldValue.increment(amount),
        valuation: FieldValue.increment(-amount),
      });
      t.update(portDoc, {
        [`${stock}.volume`]: FieldValue.increment(-volume),
        [`${stock}.totalValue`]: FieldValue.increment(-amount),
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
