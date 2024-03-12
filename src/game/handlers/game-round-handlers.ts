import {
  stocksCurrentColName,
  stocksDataColName,
  playerDataColName,
  gameStateColName,
  gameStateDocName,
} from '../../common/app-config.js';
import {
  PlayerDataConverter,
  StockCurrentConverter,
  StockDataConverter,
  GameStateConverter,
} from '../../converters/index.js';
import { getFirestoreDb } from '../../services/firebase.js';
import { maxGameRounds } from '../../common/game-config.js';
import type { IGameState } from '../../types';

export function getPersistedGameState() {
  const firebase = getFirestoreDb();
  return firebase
    .collection(gameStateColName)
    .withConverter(GameStateConverter)
    .doc(gameStateDocName)
    .get()
    .then((doc) => doc.data());
}

export async function persistGameState(newGameState: IGameState) {
  const firebase = getFirestoreDb();
  return firebase
    .collection(gameStateColName)
    .withConverter(GameStateConverter)
    .doc(gameStateDocName)
    .set(newGameState);
}

export async function updateStockPrices(gameState: IGameState) {
  const stockCurrData = new Map<string, { value: number; volTraded: number }>();
  const listedStocks = new Array<string>();
  const firestore = getFirestoreDb();
  const stockData = (
    await firestore
      .collection(stocksDataColName)
      .withConverter(StockDataConverter)
      .doc(`R${gameState.roundNo}`)
      .get()
  ).data()!;
  const stockCurrColRef = firestore
    .collection(stocksCurrentColName)
    .withConverter(StockCurrentConverter);
  (await stockCurrColRef.get()).docs.forEach(function (doc) {
    stockCurrData.set(doc.id, doc.data());
    listedStocks.push(doc.id);
  });
  const batch = firestore.batch();

  for (const stock of listedStocks) {
    const { value } = stockCurrData.get(stock)!;
    const { bpc } = stockData[stock];
    const newValue = calculateStockPrice(bpc, value);
    batch.update(stockCurrColRef.doc(stock), { value: newValue });
  }

  await batch.commit();
}

function calculateStockPrice(bpc: number, value: number) {
  bpc = (100 + bpc) / 100;
  return value * bpc;
}

export async function updatePlayerPortfolioValuation() {
  const firestore = getFirestoreDb();
  const stockData = new Map<string, { value: number; volTraded: number }>();
  (
    await firestore
      .collection(stocksCurrentColName)
      .withConverter(StockCurrentConverter)
      .get()
  ).docs.forEach(function (doc) {
    stockData.set(doc.id, doc.data());
  });
  const players = await firestore
    .collection(playerDataColName)
    .withConverter(PlayerDataConverter)
    .get();
  const batch = firestore.batch();

  players.forEach(function (player) {
    const playerData = player.data();
    let valuation = 0;

    for (const stock in playerData.portfolio) {
      const currentValue = stockData.get(stock)!.value;
      valuation += playerData.portfolio[stock].volume * currentValue;
    }

    batch.update(player.ref, { valuation: valuation });
  });

  await batch.commit();
}

export async function giveFreebie(gameState: IGameState) {
  const nextRound = gameState.roundNo + 1;
  if (nextRound > maxGameRounds) {
    return;
  }

  const firestore = getFirestoreDb();
  const stockData = (
    await firestore
      .collection(stocksDataColName)
      .withConverter(StockDataConverter)
      .doc(`R${nextRound}`)
      .get()
  ).data()!;
  const stockCurrColRef = firestore
    .collection(stocksCurrentColName)
    .withConverter(StockCurrentConverter);
  const listedStocks = new Set(
    (await stockCurrColRef.get()).docs.map((doc) => doc.id),
  );
  const unlistedStocks = Object.keys(stockData).filter(function (stockId) {
    return !listedStocks.has(stockId);
  });
  const players = await firestore
    .collection(playerDataColName)
    .withConverter(PlayerDataConverter)
    .get();
  const batch = firestore.batch();

  players.forEach(function (player) {
    type freebieField = `portfolio.${string}`;
    const freebies: Record<freebieField, { volume: number }> = {};
    for (const stock of unlistedStocks) {
      freebies[`portfolio.${stock}`] = { volume: stockData[stock].freebies };
    }

    batch.update(player.ref, freebies);
  });

  await batch.commit();
}

export async function enlistNewStocks(gameState: IGameState) {
  const nextRound = gameState.roundNo + 1;
  if (nextRound > maxGameRounds) {
    return;
  }

  const firestore = getFirestoreDb();
  const stockData = (
    await firestore
      .collection(stocksDataColName)
      .withConverter(StockDataConverter)
      .doc(`R${nextRound}`)
      .get()
  ).data()!;
  const stockCurrColRef = firestore
    .collection(stocksCurrentColName)
    .withConverter(StockCurrentConverter);
  const listedStocks = new Set(
    (await stockCurrColRef.get()).docs.map((doc) => doc.id),
  );
  const unlistedStocks = Object.keys(stockData).filter(function (stockId) {
    return !listedStocks.has(stockId);
  });
  const batch = firestore.batch();

  unlistedStocks.forEach(function (stock) {
    batch.create(stockCurrColRef.doc(stock), {
      value: stockData[stock].initialValue,
      volTraded: 0,
    });
  });

  await batch.commit();
}
