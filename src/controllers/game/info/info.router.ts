import { Router } from 'express';
import {
  getGameInfoHandler,
  getNewsHandler,
  getStocksHandler,
  getLeaderboardHandler,
  getProfileHandler,
  getPortfolioHandler,
  getBalenceHandler,
} from './info.contorller';
import { cacherFactory } from '@middlewares/cacher.middleware';
import { cacheTime } from '@common/app.config';

export const infoRouter = Router();

const cacher = cacherFactory(cacheTime);

infoRouter.get('/game-info', getGameInfoHandler);
infoRouter.get('/news', cacher, getNewsHandler);
infoRouter.get('/stocks', cacher, getStocksHandler);
infoRouter.get('/leaderboard', cacher, getLeaderboardHandler);
infoRouter.get('/profile', getProfileHandler);
infoRouter.get('/portfolio', getPortfolioHandler);
infoRouter.get('/balance', getBalenceHandler);
