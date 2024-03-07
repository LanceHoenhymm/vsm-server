import { Router } from 'express';
import {
  getGameInfo,
  getNews,
  getStocks,
  getLeaderboard,
  getProfile,
  getPortfolio,
  getBalence,
} from './info.contorller.js';

export const infoRouter = Router();

infoRouter.get('/game-info', getGameInfo);
infoRouter.get('/news', getNews);
infoRouter.get('/stocks', getStocks);
infoRouter.get('/leaderboard', getLeaderboard);
infoRouter.get('/profile', getProfile);
infoRouter.get('/portfolio', getPortfolio);
infoRouter.get('/balance', getBalence);
