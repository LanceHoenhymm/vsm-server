import { Router } from 'express';
import { infoRouter } from './info/infor.router';
import { buyStockHandler, sellStockHandler } from './game.controller';

export const gameRouter = Router();

gameRouter.use('/info', infoRouter);
gameRouter.post('/buy-stock', buyStockHandler);
gameRouter.post('/sell-stock', sellStockHandler);
