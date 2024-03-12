import { getFirestoreDb } from '../../../services/firebase.js';
import {
  PlayerDataConverter,
  StockDataConverter,
} from '../../../converters/index.js';
import {
  playerDataColName,
  stocksDataColName,
} from '../../../common/app-config.js';
import { startingAmount } from '../../../common/game-config.js';

export async function initPlayer(teamId: string) {
  const firestore = getFirestoreDb();
  const playerDataColRef = firestore
    .collection(playerDataColName)
    .withConverter(PlayerDataConverter);
  const stockData = (
    await firestore
      .collection(stocksDataColName)
      .withConverter(StockDataConverter)
      .doc('R1')
      .get()
  ).data()!;

  if ((await playerDataColRef.doc(teamId).get()).exists) {
    return;
  }

  const freePortfolio: { [stock: string]: { volume: number } } = {};
  let freeValuation = 0;
  for (const stock in stockData) {
    freePortfolio[stock] = { volume: stockData[stock].freebies };
    freeValuation += stockData[stock].freebies * stockData[stock].initialValue;
  }

  return playerDataColRef.doc(teamId).set({
    balance: startingAmount,
    valuation: freeValuation,
    portfolio: freePortfolio,
  });
}
