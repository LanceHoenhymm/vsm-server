import { FieldValue } from 'firebase-admin/firestore';
import {
  newsDataColName,
  playerDataColName,
  playerPortColName,
  stocksCurrentColName,
  transactionsColName,
} from '../common/app-config';
import {
  IPlayerData,
  IStockCurrentData,
  IPlayerPortfolio,
  PlayerDataConverter,
  StockCurrentConverter,
  PlayerPortfolioConverter,
  TransactionsConverter,
  NewsDataConverter,
  INewsData,
} from '../converters';
import { getFirestoreDb } from '../services/firebase';
import { getState } from './game-state-loop';
import { muftMoneyAwarded } from './game-config';

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
      await Promise.all([t.get(stockDoc), playerDoc.get(), portDoc.get()])
    ).map((d) => d.data()) as [IStockCurrentData, IPlayerData];
    const amount = volume * stockData.value;

    if (amount > playerData.balance) {
      return Promise.reject('Insufficient Balance');
    } else if (stockData.volTraded >= stockData.maxVolTrad) {
      return Promise.reject('Max Transaction Reached');
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

      return Promise.resolve('Transaction Complete');
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
      await Promise.all([t.get(stockDoc), t.get(playerDoc), t.get(portDoc)])
    ).map((d) => d.data()) as [IStockCurrentData, IPlayerPortfolio];
    const amount = stockData.value * volume;

    if (
      !Object.prototype.hasOwnProperty.call(portData, stock) ||
      portData[stock].volume < volume
    ) {
      return Promise.reject(`Insufficient Stocks`);
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

      return Promise.resolve('Transaction Complete');
    }
  });
}

export function usePowercardInsider(teamId: string) {
  const firestore = getFirestoreDb();
  const playerDoc = firestore
    .collection(playerDataColName)
    .withConverter(PlayerDataConverter)
    .doc(teamId);
  const newsDoc = firestore
    .collection(newsDataColName)
    .withConverter(NewsDataConverter)
    .doc(`R${getState().roundNo}`);

  return firestore.runTransaction(async (t) => {
    const [playerData, newsData] = (
      await Promise.all([t.get(playerDoc), t.get(newsDoc)])
    ).map((d) => d.data()) as [IPlayerData, INewsData];

    if (playerData.powercards.insider === 'used') {
      return Promise.reject('Powercard Already Used');
    } else {
      const insiderNews = Object.values(newsData).filter((n) => n.forInsider);
      const randomInsiderNews =
        insiderNews[Math.floor(Math.random() * insiderNews.length)];

      t.update(playerDoc, { 'powercards.insider': 'used' });

      return Promise.resolve(randomInsiderNews);
    }
  });
}

export function usePowercardMuft(teamId: string) {
  return getFirestoreDb()
    .collection(playerDataColName)
    .withConverter(PlayerDataConverter)
    .doc(teamId)
    .update({
      balance: FieldValue.increment(muftMoneyAwarded),
      'powercards.muft': 'active',
    });
}
