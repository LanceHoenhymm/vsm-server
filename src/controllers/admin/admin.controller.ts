import type { ReqHandler } from '@/types';
import type {
  IAddNewsRequestDto,
  IAddStockRequestDto,
} from './admin.controller.dto';
import { StatusCodes } from 'http-status-codes';
import { uploadNews, uploadStock } from '@game/helpers/chore';

type AddNewsHandler = ReqHandler<IAddNewsRequestDto>;

export const addNews: AddNewsHandler = async function (req, res) {
  const newsData = req.body;
  await uploadNews(newsData);
  res.status(StatusCodes.OK).json({ status: 'Success' });
};

type AddStocksHandler = ReqHandler<IAddStockRequestDto>;

export const addStock: AddStocksHandler = async function (req, res) {
  const stockData = req.body;
  await uploadStock(stockData);
  res.status(StatusCodes.OK).json({ status: 'Success' });
};
