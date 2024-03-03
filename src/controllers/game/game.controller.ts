import type { ReqHandler } from '../../types';
import { IBuySellDto } from './game.controller.dto';
import { buyStock, sellStock } from '../../game/handlers/game-stock-handlers';
import { getState } from '../../game/game';
import { StatusCodes } from 'http-status-codes';
import { BadRequest, Unauthorized } from '../../errors';

type BuySellHandler = ReqHandler<IBuySellDto>;

export const buyStockHandler: BuySellHandler = function (req, res) {
  if (getState().stage != 'TRADING_STAGE') {
    throw new Unauthorized('Not Trading Stage');
  }

  const teamId = req.player.teamId;
  const { stock, amount } = req.body;

  if (!stock || !amount) {
    throw new BadRequest('Stock Name or Amount Invalid');
  }
  console.log(stock, amount);

  buyStock(teamId, stock, amount)
    .then(() => {
      res.status(StatusCodes.OK).json({
        status: 'Success',
        data: { msg: `${amount} of ${stock} bought` },
      });
    })
    .catch((err) => {
      res
        .status(StatusCodes.IM_A_TEAPOT)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        .json({ status: 'Failure', data: { err } });
    });
};

export const sellStockHandler: BuySellHandler = function (req, res) {
  if (getState().stage != 'TRADING_STAGE') {
    throw new Unauthorized('Not Trading Stage');
  }

  const teamId = req.player.teamId;
  const { stock, amount } = req.body;

  if (!stock || !amount) {
    throw new BadRequest('Stock Name or Amount Invalid');
  }

  sellStock(teamId, stock, amount)
    .then(() => {
      res.status(StatusCodes.OK).json({
        status: 'Success',
        data: { msg: `${amount} of ${stock} sold` },
      });
    })
    .catch((err) => {
      res
        .status(StatusCodes.IM_A_TEAPOT)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        .json({ status: 'Failure', data: { err } });
    });
};
