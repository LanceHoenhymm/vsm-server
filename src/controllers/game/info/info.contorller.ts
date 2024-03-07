import type { ReqHandler } from '../../../types';
import { getFirestoreDb } from '../../../services/firebase.js';
import {
  newsDataColName,
  playerDataColName,
  stocksCurrentColName,
  usersColName,
} from '../../../common/app-config.js';
import { getState } from '../../../game/game.js';
import {
  NewsDataConverter,
  PlayerDataConverter,
  StockCurrentConverter,
  User,
} from '../../../converters/index.js';
import { StatusCodes } from 'http-status-codes';

type InfoEndpointHandler = ReqHandler<object>;

export const getNews: InfoEndpointHandler = async function (req, res) {
  const firestore = getFirestoreDb();
  const newsData = (
    await firestore
      .collection(newsDataColName)
      .withConverter(NewsDataConverter)
      .doc(`R${getState().roundNo}`)
      .get()
  ).data()!;

  const news: string[] = [];

  for (const key in newsData) {
    if (!newsData[key].forInsider) {
      news.push(newsData[key].news);
    }
  }

  res.status(StatusCodes.OK).json({
    status: 'Success',
    data: news,
  });
};

export const getStocks: InfoEndpointHandler = async function (req, res) {
  const firestore = getFirestoreDb();
  const stocks = (
    await firestore
      .collection(stocksCurrentColName)
      .withConverter(StockCurrentConverter)
      .get()
  ).docs.map(function (data) {
    return { id: data.id, value: data.data().value };
  });

  res.status(StatusCodes.OK).json({
    status: 'Success',
    data: stocks,
  });
};

export const getLeaderboard: InfoEndpointHandler = async function (req, res) {
  const playerWealth = new Map<string, number>();
  const playerNames = new Map<string, string>();
  const firestore = getFirestoreDb();

  (
    await firestore
      .collection(playerDataColName)
      .withConverter(PlayerDataConverter)
      .get()
  ).docs.forEach(function (data) {
    const { valuation, balance } = data.data();
    playerWealth.set(data.id, valuation + balance);
  });
  (
    await firestore.collection(usersColName).withConverter(User.converter).get()
  ).docs.forEach(function (data) {
    const { p1Name, p2Name } = data.data();
    playerNames.set(data.id, p1Name + (p2Name ? ` & ${p2Name}` : ''));
  });

  const leaderboard = Array.from(playerWealth.entries())
    .sort((a, b) => b[1] - a[1])
    .map(function ([id, wealth], i) {
      return {
        rank: i + 1,
        name: playerNames.get(id)!,
        wealth,
      };
    });

  res.status(StatusCodes.OK).json({ status: 'Success', data: leaderboard });
};

export const getGameInfo: InfoEndpointHandler = function (req, res) {
  const { roundNo, stage } = getState();
  res.status(StatusCodes.OK).json({
    status: 'Success',
    data: {
      roundNo,
      stage,
    },
  });
};

export const getProfile: InfoEndpointHandler = async function (req, res) {
  const firestore = getFirestoreDb();
  const playerData = (
    await firestore
      .collection(playerDataColName)
      .withConverter(PlayerDataConverter)
      .doc(req.player.teamId)
      .get()
  ).data()!;

  const profile = {
    balence: playerData.balance,
    valuation: playerData.valuation,
    powercards: playerData.powercards,
  };

  res.status(StatusCodes.OK).json({
    status: 'Success',
    data: profile,
  });
};

export const getPortfolio: InfoEndpointHandler = async function (req, res) {
  const firestore = getFirestoreDb();
  const playerData = (
    await firestore
      .collection(playerDataColName)
      .withConverter(PlayerDataConverter)
      .doc(req.player.teamId)
      .get()
  ).data()!;
  const stockData = new Map<string, { value: number; volTraded: number }>(
    (
      await firestore
        .collection(stocksCurrentColName)
        .withConverter(StockCurrentConverter)
        .get()
    ).docs.map(function (d) {
      return [d.id, d.data()];
    }),
  );

  const portfolio = [];
  for (const stock in playerData.portfolio) {
    portfolio.push({
      name: stock,
      volume: playerData.portfolio[stock].volume,
      value: stockData.get(stock)!.value * playerData.portfolio[stock].volume,
    });
  }

  res.status(StatusCodes.OK).json({
    status: 'Success',
    data: {
      valuation: playerData.valuation,
      portfolio,
    },
  });
};

export const getBalence: InfoEndpointHandler = async function (req, res) {
  const firestore = getFirestoreDb();
  const playerData = (
    await firestore
      .collection(playerDataColName)
      .withConverter(PlayerDataConverter)
      .doc(req.player.teamId)
      .get()
  ).data()!;

  res.status(StatusCodes.OK).json({
    status: 'Success',
    data: { balance: playerData.balance },
  });
};
