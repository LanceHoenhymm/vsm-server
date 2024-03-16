import type { Request, Response, NextFunction } from 'express';
import { cache } from '../services/index.js';
import { logger } from '../services/index.js';

export function cacherFactory(duration: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = '__express__' + req.originalUrl || req.url;
    const cachedValue = cache.get(key);

    if (cachedValue) {
      logger.info('Cache hit on: ', key);

      res.send(cachedValue);
    } else {
      logger.info('Cache miss on: ', key);

      const sendResponse = res.send;
      res.send = (body) => {
        cache.set(key, body, duration);
        return sendResponse(body);
      };
      next();
    }
  };
}
