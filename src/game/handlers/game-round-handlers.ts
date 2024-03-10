import EventEmitter from 'events';
import { Server } from 'socket.io';
import {
  stocksCurrentColName,
  stocksDataColName,
  playerDataColName,
} from '../../common/app-config.js';
import {
  PlayerDataConverter,
  StockCurrentConverter,
  StockDataConverter,
} from '../../converters/index.js';
import { getFirestoreDb } from '../../services/firebase.js';
import { IGameState, muftMoneyAwarded } from '../../common/game-config.js';
import { FieldValue } from 'firebase-admin/firestore';

export function registerGameRoundHandler(
  emitter: EventEmitter,
  stateFunction: () => IGameState,
  io: Server,
) {
  emitter.on('game:stage:CALCULATION_STAGE', onCalculationStage(stateFunction));

  emitter.on('game:on', () => {
    io.emit('game:on');
  });
  emitter.on('game:stage:TRADING_STAGE', () => {
    io.emit('game:stage:TRADING_STAGE');
  });
  emitter.on('game:stage:CALCULATION_STAGE', () => {
    io.emit('game:stage:CALCULATION_STAGE');
  });
  emitter.on('game:round', () => {
    io.emit('game:round');
  });
  emitter.on('game:end', () => {
    io.emit('game:end');
  });
}

async function onStageChange(newGameState: IGameState) {
  const firebase = getFirestoreDb();
  const gameStateDoc = firebase
    .collection(gameStateColName)
    .withConverter(GameStateConverter)
    .doc(gameStateDocName);

  await gameStateDoc.set(newGameState);
}

async function updateStockPrices(stateFn: () => IGameState) {
  const stockCurrData = new Map<string, { value: number; volTraded: number }>();
  const firestore = getFirestoreDb();
  const stockData = (
    await firestore
      .collection(stocksDataColName)
      .withConverter(StockDataConverter)
      .doc(`R${stateFn().roundNo}`)
      .get()
  ).data()!;
  const stockCurrColRef = firestore
    .collection(stocksCurrentColName)
    .withConverter(StockCurrentConverter);
  (await stockCurrColRef.get()).docs.forEach(function (doc) {
    stockCurrData.set(doc.id, doc.data());
  });
  const batch = firestore.batch();

  for (const stock in stockData) {
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

async function updatePlayerPortfolioValuation() {
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

async function updatePlayerPowerCardStatus() {
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
