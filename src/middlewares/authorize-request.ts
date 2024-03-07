import type { Request, Response, NextFunction } from 'express';
import { Unauthorized } from '../errors/index.js';

export function authorizeRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.player.admin) {
    throw new Unauthorized('Forbidden Endpoint');
  }
  next();
}
