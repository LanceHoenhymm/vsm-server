import { StatusCodes } from 'http-status-codes';
import { newsDataColName, stocksDataColName } from '../../common/app-config.js';
import {
  type INewsData,
  NewsDataConverter,
  StockDataConverter,
} from '../../converters/index.js';
import { getFirestoreDb } from '../../services/firebase.js';
import type { ReqHandler } from '../../types';
import type {
  IAddNewsRequestDto,
  IAddStockRequestDto,
} from './admin.controller.dto.js';

type AddNewsHandler = ReqHandler<IAddNewsRequestDto>;

export const addNews: AddNewsHandler = async function (req, res) {
  const firestore = getFirestoreDb();
  const newsDataColRef = firestore
    .collection(newsDataColName)
    .withConverter(NewsDataConverter);
  const batch = firestore.batch();
  const { newsData } = req.body;

  newsData.forEach(function (newsArr, roundNo) {
    const newsDoc: INewsData = newsArr.reduce(function (arr, curr, index) {
      return { ...arr, [index]: curr };
    }, {});
    batch.create(newsDataColRef.doc(`R${roundNo + 1}`), newsDoc);
  });

  await batch.commit();

  res.status(StatusCodes.OK).json({ status: 'Success' });
};

type AddStocksHandler = ReqHandler<IAddStockRequestDto>;

export const addStock: AddStocksHandler = async function (req, res) {
  const firestore = getFirestoreDb();
  const stockDataColRef = firestore
    .collection(stocksDataColName)
    .withConverter(StockDataConverter);
  const batch = firestore.batch();
  const { stockData } = req.body;

  stockData.forEach(function (stockDocData) {
    const stockDoc = stockDataColRef.doc(stockDocData.roundNo);
    const stocksData = Object.fromEntries(
      stockDocData.stocks.map(function (stock) {
        return [
          stock.id,
          {
            bpc: stock.bpc,
            maxVolTrad: stock.maxVolTrad,
            initialValue: stock.maxVolTrad,
          },
        ];
      }),
    );
    batch.create(stockDoc, stocksData);
  });

  await batch.commit();

  res.status(StatusCodes.OK).json({ status: 'Success' });
};
