import type { ReqHandler } from '../../../types';
import { getFirestoreDb } from '../../../services/firebase';
import {
  newsDataColName,
  playerDataColName,
  stocksCurrentColName,
} from '../../../common/app-config';
import { getState } from '../../../game/game';
import {
  NewsDataConverter,
  PlayerDataConverter,
  StockCurrentConverter,
} from '../../../converters';
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
  ).docs.map((d) => d.data().value);

  res.status(StatusCodes.OK).json({
    status: 'Success',
    data: stocks,
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getLeaderboard: InfoEndpointHandler = async function (req, res) {};

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
  const stockData = (
    await firestore
      .collection(stocksCurrentColName)
      .withConverter(StockCurrentConverter)
      .get()
  ).docs.map(function (d) {
    return { id: d.id, value: d.data().value };
  });

  const portfolio = [];
  for (const stock in playerData.portfolio) {
    portfolio.push({
      name: stock,
      volume: playerData.portfolio[stock].volume,
      value:
        stockData.find((s) => s.id === stock)!.value *
        playerData.portfolio[stock].volume,
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
