import { FieldValue } from 'firebase-admin/firestore';
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
import { muftMoneyAwarded } from '../../common/game-config.js';
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
    const { value, volTraded } = stockCurrData.get(stock)!;
    const { bpc, maxVolTrad } = stockData[stock];
    const newValue = calculateStockPrice(bpc, value, volTraded, maxVolTrad);
    batch.update(stockCurrColRef.doc(stock), { value: newValue });
  }

  await batch.commit();
}

function calculateStockPrice(
  bpc: number,
  value: number,
  volTraded: number,
  maxVolTrad: number,
) {
  const demand = volTraded / maxVolTrad;
  bpc = (100 + bpc) / 100;
  return value * bpc * demand;
}

export async function enlistNewStocks(gameState: IGameState) {
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
  const unlisted = (await stockCurrColRef.get()).docs
    .map((doc) => doc.id)
    .filter((stock) => !Object.prototype.hasOwnProperty.call(stockData, stock));
  const batch = firestore.batch();

  unlisted.forEach(function (stock) {
    batch.create(stockCurrColRef.doc(stock), {
      value: stockData[stock].initialValue,
      volTraded: 0,
    });
  });

  await batch.commit();
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

export async function updatePlayerPowerCardStatus() {
  const firestore = getFirestoreDb();
  const players = await firestore
    .collection(playerDataColName)
    .withConverter(PlayerDataConverter)
    .get();
  const batch = firestore.batch();

  players.forEach(function (player) {
    const playerData = player.data();
    if (playerData.powercards.muft === 'active') {
      batch.update(player.ref, {
        'powercards.muft': 'used',
        balance: FieldValue.increment(-muftMoneyAwarded),
      });
    } else if (playerData.powercards.options.status === 'active') {
      // pass
    }
  });

  await batch.commit();
}
