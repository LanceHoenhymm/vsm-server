import type { ReqHandler } from '@/types';
import { IBuySellDto } from './game.controller.dto';
import { StatusCodes } from 'http-status-codes';

type BuySellHandler = ReqHandler<IBuySellDto>;

export const buyStockHandler: BuySellHandler = function (req, res) {
  res.status(StatusCodes.OK).json({ status: 'Success' });
};

export const sellStockHandler: BuySellHandler = function (req, res) {
  res.status(StatusCodes.OK).json({ status: 'Success' });
};
