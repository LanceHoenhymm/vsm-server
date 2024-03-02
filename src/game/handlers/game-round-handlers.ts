import EventEmitter from 'events';
import {
  stocksCurrentColName,
  stocksDataColName,
  playerDataColName,
} from '../../common/app-config';
import {
  IPlayerData,
  IStockData,
  IStockCurrentData,
  PlayerDataConverter,
  StockCurrentConverter,
  StockDataConverter,
} from '../../converters';
import { getFirestoreDb } from '../../services/firebase';
import { IGameState, muftMoneyAwarded } from '../game-config';
import { FieldValue } from 'firebase-admin/firestore';

function onRoundChange() {
  console.log('every round');
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

async function updateStockPrice(stock: string, data: IStockData[string]) {
  const firestore = getFirestoreDb();
  const stockCurrDoc = firestore
    .collection(stocksCurrentColName)
    .withConverter(StockCurrentConverter)
    .doc(stock);

  const stockCurr = (await stockCurrDoc.get()).data()!;

  const newPrice = calculateStockPrice(
    data.bpc,
    stockCurr.value,
    stockCurr.volTraded,
    data.maxVolTrad,
  );

  await stockCurrDoc.update({
    value: newPrice,
  });
}

async function updateStockPrices(stateFn: () => IGameState) {
  const firestore = getFirestoreDb();
  const stockData = (
    await firestore
      .collection(stocksDataColName)
      .withConverter(StockDataConverter)
      .doc(`R${stateFn().roundNo}`)
      .get()
  ).data()!;
  const promises: Promise<void>[] = [];

  for (const stock in stockData) {
    promises.push(updateStockPrice(stock, stockData[stock]));
  }

  await Promise.all(promises);
}

async function handlePowerCardUse(
  player: FirebaseFirestore.QueryDocumentSnapshot<IPlayerData>,
) {
  const playerData = player.data();

  if (playerData.powercards.muft === 'active') {
    await player.ref.update({
      'powercards.muft': 'used',
      balance: FieldValue.increment(-muftMoneyAwarded),
    });
  } else if (playerData.powercards.options.status === 'active') {
    // pass
  }
}

async function updatePortfolioValuation(
  player: FirebaseFirestore.QueryDocumentSnapshot<IPlayerData>,
  stockData: (IStockCurrentData & { id: string })[],
) {
  const playerData = player.data();
  let valuation = 0;

  for (const stock in playerData.portfolio) {
    const currentValue = stockData.find((s) => s.id === stock)!.value;
    valuation += playerData.portfolio[stock].volume * currentValue;
  }

  await player.ref.update({
    valuation: valuation,
  });
}

async function updatePlayersData() {
  const firestore = getFirestoreDb();
  const players = await firestore
    .collection(playerDataColName)
    .withConverter(PlayerDataConverter)
    .get();
  const stockData = (
    await firestore
      .collection(stocksCurrentColName)
      .withConverter(StockCurrentConverter)
      .get()
  ).docs.map(function (doc) {
    return { id: doc.id, ...doc.data() };
  });
  const promises: Promise<void>[] = [];

  players.forEach((player) => {
    promises.push(updatePortfolioValuation(player, stockData));
    promises.push(handlePowerCardUse(player));
  });

  await Promise.all(promises);
}

function onCalculationStage(stateFn: () => IGameState) {
  return async function () {
    try {
      await updateStockPrices(stateFn);
      await updatePlayersData();
    } catch (e) {
      console.error(e);
    }
  };
}

export function registerGameRoundHandler(
  emitter: EventEmitter,
  stateFunction: () => IGameState,
) {
  emitter.on('game:stage:CALCULATION_STAGE', onCalculationStage(stateFunction));
  emitter.on('game:round', onRoundChange);
}
