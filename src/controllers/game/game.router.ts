import { Router } from 'express';
import { infoRouter } from './info/info.router.js';
import { buyStockHandler, sellStockHandler } from './game.controller.js';
import { validatorFactory } from '../../middlewares/validator.middleware.js';
import { stockBuySellDtoSchema } from './game.controller.dto.js';

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
