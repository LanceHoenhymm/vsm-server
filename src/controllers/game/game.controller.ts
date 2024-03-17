import type { ReqHandler } from '@/types';
import { IBuySellDto } from './game.controller.dto';
import { BadRequest } from '@errors/index';
import { StatusCodes } from 'http-status-codes';
import { buyStock, sellStock } from '@game/game.handlers';
import { getGameState } from '@game/game';

type BuySellHandler = ReqHandler<IBuySellDto>;

export const buyStockHandler: BuySellHandler = async function (req, res) {
  const { stock: stockId, amount: quantity } = req.body;
  if (!stockId || !quantity) {
    throw new BadRequest('StockId or Quantity not Provided');
  }
  await buyStock(req.player.playerId, stockId, quantity, getGameState());
  res.status(StatusCodes.OK).json({
    status: 'Success',
    data: { msg: `${quantity} stocks of ${stockId} bought` },
  });
};

export const sellStockHandler: BuySellHandler = async function (req, res) {
  const { stock: stockId, amount: quantity } = req.body;
  if (!stockId || !quantity) {
    throw new BadRequest('StockId or Quantity not Provided');
  }
  await sellStock(req.player.playerId, stockId, quantity, getGameState());
  res.status(StatusCodes.OK).json({
    status: 'Success',
    data: { msg: `${quantity} stocks of ${stockId} sold` },
  });
};
