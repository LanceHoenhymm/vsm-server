import type { ReqHandler } from '../../types';
import { IBuySellDto } from './game.controller.dto.js';
import {
  buyStock,
  sellStock,
} from '../../game/handlers/game-stock-handlers.js';
import { getState } from '../../game/game.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequest, Unauthorized } from '../../errors/index.js';

type BuySellHandler = ReqHandler<IBuySellDto>;

export const buyStockHandler: BuySellHandler = async function (req, res) {
  if (getState().stage != 'TRADING_STAGE') {
    throw new Unauthorized('Not Trading Stage');
  }

  const teamId = req.player.teamId;
  const { stock, amount } = req.body;

  if (!stock || !amount) {
    throw new BadRequest('Stock Name or Amount Invalid');
  }

  try {
    await buyStock(teamId, stock, amount);

    res.status(StatusCodes.OK).json({
      status: 'Success',
      data: { msg: `${amount} stocks of ${stock} bought` },
    });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ status: 'Failure', data: { msg: error.message } });
    } else {
      throw error;
    }
  }
};

export const sellStockHandler: BuySellHandler = async function (req, res) {
  if (getState().stage != 'TRADING_STAGE') {
    throw new Unauthorized('Not Trading Stage');
  }

  const teamId = req.player.teamId;
  const { stock, amount } = req.body;

  if (!stock || !amount) {
    throw new BadRequest('Stock Name or Amount Invalid');
  }

  try {
    await sellStock(teamId, stock, amount);

    res.status(StatusCodes.OK).json({
      status: 'Success',
      data: { msg: `${amount} stocks of ${stock} sold` },
    });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ status: 'Failure', data: { err: error.message } });
    } else {
      throw error;
    }
  }
};
