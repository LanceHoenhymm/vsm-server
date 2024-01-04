import {
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
} from '../converters';
import { getFirestoreDb } from '../services/firebase';

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
    const [stockData, playerData, portData] = (
      await Promise.all([t.get(stockDoc), playerDoc.get(), portDoc.get()])
    ).map((d) => d.data()) as [
      IStockCurrentData,
      IPlayerData,
      IPlayerPortfolio,
    ];
    const amount = volume * stockData.value;

    if (amount > playerData.balance) {
      throw new Error('Insufficient Balance');
    } else if (stockData.volTraded >= stockData.maxVolTrad) {
      throw new Error('Max Transaction Reached');
    } else {
      t.update(stockDoc, { volTraded: stockData.volTraded + volume });
      t.update(playerDoc, {
        balance: playerData.balance - amount,
        valuation: playerData.valuation + amount,
      });
      t.set(
        portDoc,
        {
          [stock]: {
            volume: portData[stock].volume + volume,
            totalValue: portData[stock].totalValue + amount,
          },
        },
        { mergeFields: [`${stock}.amount`, `${stock}.totalValue`] },
      );
      t.set(transactionDoc, { teamId, stock, volume, amount, type: 'buy' });
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
    const [stockData, playerData, portData] = (
      await Promise.all([t.get(stockDoc), t.get(playerDoc), t.get(portDoc)])
    ).map((d) => d.data()) as [
      IStockCurrentData,
      IPlayerData,
      IPlayerPortfolio,
    ];
    const amount = stockData.value * volume;

    if (!Object.prototype.hasOwnProperty.call(portData, stock)) {
      throw new Error(`Insufficient Stocks`);
    } else if (portData[stock].volume < volume) {
      throw new Error(`Insufficient Stocks`);
    } else {
      t.update(playerDoc, {
        balance: playerData.balance + amount,
        valuation: playerData.valuation - amount,
      });
      t.set(
        portDoc,
        {
          [stock]: {
            volume: portData[stock].volume - volume,
            totalValue: portData[stock].totalValue - amount,
          },
        },
        { mergeFields: [`${stock}.amount`, `${stock}.totalValue`] },
      );
      t.set(transactionDoc, { teamId, stock, volume, amount, type: 'sell' });
    }
  });
}

export function usePowercard() {}
