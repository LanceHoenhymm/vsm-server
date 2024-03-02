import { Router } from 'express';
import { infoRouter } from './info/info.router';
import { buyStockHandler, sellStockHandler } from './game.controller';
import { validatorFactory } from '../../middlewares/validator-factory';
import { stockBuySellDtoSchema } from './game.controller.dto';

export const gameRouter = Router();

gameRouter.use('/info', infoRouter);
gameRouter.post(
  '/buy-stock',
  validatorFactory(stockBuySellDtoSchema),
  buyStockHandler,
);
gameRouter.post(
  '/sell-stock',
  validatorFactory(stockBuySellDtoSchema),
  sellStockHandler,
);
