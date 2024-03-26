import { Router } from 'express';
import { authorizeAdmin } from '../../middlewares/authorizer.middleware';
import { validatorFactory } from '../../middlewares/validator.middleware';
import {
  addNewsRequestDtoSchema,
  addStockRequestDtoSchema,
} from './admin.controller.dto';
import {
  addNews,
  addStock,
  startGameHandler,
  startRoundHandler,
  terminateGameHandler,
  flushDatabaseHandler,
  flushPlayerTableHandler,
  flushUserTableHandler,
} from './admin.controller';

export const adminRouter = Router();

adminRouter.use(authorizeAdmin);
adminRouter.post(
  '/add-news',
  validatorFactory(addNewsRequestDtoSchema),
  addNews,
);
adminRouter.post(
  '/add-stock',
  validatorFactory(addStockRequestDtoSchema),
  addStock,
);
adminRouter.post('/start-game', startGameHandler);
adminRouter.post('/start-round', startRoundHandler);
adminRouter.post('/terminate-game', terminateGameHandler);
adminRouter.post('/flush-database', flushDatabaseHandler);
adminRouter.post('/flush-player-table', flushPlayerTableHandler);
adminRouter.post('/flush-user-table', flushUserTableHandler);
