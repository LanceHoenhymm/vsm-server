import type { ReqHandler } from '@/types';
import type {
  IAddNewsRequestDto,
  IAddStockRequestDto,
} from './admin.controller.dto';
import { StatusCodes } from 'http-status-codes';

type AddNewsHandler = ReqHandler<IAddNewsRequestDto>;

export const addNews: AddNewsHandler = function (req, res) {
  res.status(StatusCodes.OK).json({ status: 'Success' });
};

type AddStocksHandler = ReqHandler<IAddStockRequestDto>;

export const addStock: AddStocksHandler = function (req, res) {
  res.status(StatusCodes.OK).json({ status: 'Success' });
};
