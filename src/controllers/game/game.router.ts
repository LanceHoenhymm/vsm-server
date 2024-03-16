import { Router } from 'express';
import { validatorFactory } from '@/middlewares/validator.middleware';
import { stockBuySellDtoSchema } from './game.controller.dto';
import { buyStockHandler, sellStockHandler } from './game.controller';
import { infoRouter } from './info/info.router';

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
