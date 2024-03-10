import { Router, type RequestHandler } from 'express';
import { middleware } from 'apicache';
import {
  getGameInfo,
  getNews,
  getStocks,
  getLeaderboard,
  getProfile,
  getPortfolio,
  getBalence,
} from './info.contorller.js';
import { cacheTime } from '../../../common/app-config.js';

const apiCache = middleware(cacheTime) as RequestHandler;

export const infoRouter = Router();

infoRouter.get('/game-info', apiCache, getGameInfo);
infoRouter.get('/news', apiCache, getNews);
infoRouter.get('/stocks', apiCache, getStocks);
infoRouter.get('/leaderboard', apiCache, getLeaderboard);
infoRouter.get('/profile', getProfile);
infoRouter.get('/portfolio', getPortfolio);
infoRouter.get('/balance', getBalence);
