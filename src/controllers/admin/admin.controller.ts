import type { ReqHandler } from '@/types';
import type {
  IAddNewsRequestDto,
  IAddStockRequestDto,
} from './admin.controller.dto';
import { StatusCodes } from 'http-status-codes';
import { uploadNews, uploadStock } from '@game/helpers/chore';
import { startGame, startRound, terminateGame } from '@game/game';

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

type ControlEndpointHandler = ReqHandler<object>;

export const startGameHandler: ControlEndpointHandler = function (req, res) {
  setTimeout(startGame, 0);
  res.status(StatusCodes.OK).json({
    status: 'Success',
  });
};

export const startRoundHandler: ControlEndpointHandler = function (req, res) {
  setTimeout(startRound, 0);
  res.status(StatusCodes.OK).json({
    status: 'Success',
  });
};

export const terminateGameHandler: ControlEndpointHandler = function (
  req,
  res,
) {
  setTimeout(terminateGame, 0);
  res.status(StatusCodes.OK).json({
    status: 'Success',
  });
};
