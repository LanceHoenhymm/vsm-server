import { FieldValue } from 'firebase-admin/firestore';
import {
  newsDataColName,
  playerDataColName,
  stocksCurrentColName,
} from '../../common/app-config';
import {
  type IPlayerData,
  type IStockCurrentData,
  type INewsData,
  PlayerDataConverter,
  StockCurrentConverter,
  NewsDataConverter,
} from '../../converters';
import { getFirestoreDb } from '../../services/firebase';
import { getState } from '../game';
import { muftMoneyAwarded } from '../game-config';

export async function usePowercardInsider(teamId: string) {
  const firestore = getFirestoreDb();
  const playerDoc = firestore
    .collection(playerDataColName)
    .withConverter(PlayerDataConverter)
    .doc(teamId);
  const newsDoc = firestore
    .collection(newsDataColName)
    .withConverter(NewsDataConverter)
    .doc(`R${getState().roundNo}`);
  const [playerData, newsData] = (
    await Promise.all([playerDoc.get(), newsDoc.get()])
  ).map((d) => d.data()) as [IPlayerData, INewsData];

  if (playerData.powercards.insider === 'unused') {
    const insiderNews = Object.values(newsData).filter((n) => n.forInsider);
    const randomInsiderNews =
      insiderNews[Math.floor(Math.random() * insiderNews.length)];

    await playerDoc.update({ 'powercards.insider': 'used' });

    return randomInsiderNews.news;
  } else {
    throw new Error('Powercard Already Used');
  }
}

export async function usePowercardMuft(teamId: string) {
  const firestore = getFirestoreDb();
  const playerDoc = firestore
    .collection(playerDataColName)
    .withConverter(PlayerDataConverter)
    .doc(teamId);
  const playerData = (await playerDoc.get()).data()!;

  if (playerData.powercards.muft === 'unused') {
    await playerDoc.update({
      balance: FieldValue.increment(muftMoneyAwarded),
      'powercards.muft': 'active',
    });
  } else {
    throw new Error('Powercard already used');
  }
}

export async function usePowercardOptions(teamId: string, stock: string) {
  const firestore = getFirestoreDb();
  const playerDoc = firestore
    .collection(playerDataColName)
    .withConverter(PlayerDataConverter)
    .doc(teamId);
  const stockDoc = firestore
    .collection(stocksCurrentColName)
    .withConverter(StockCurrentConverter)
    .doc(stock);
  const [stockData, playerData] = (
    await Promise.all([stockDoc.get(), playerDoc.get()])
  ).map((d) => d.data()) as [IStockCurrentData, IPlayerData];

  if (playerData.powercards.options.status === 'unused') {
    await playerDoc.update({
      'powercards.options.status': 'active',
      'powercards.options.forStock': stock,
      'powercards.options.lockedPrice': stockData.value,
    });
  } else {
    throw new Error('Powercard already used');
  }
}
