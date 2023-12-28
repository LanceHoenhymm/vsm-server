import type { Request, Response, NextFunction } from 'express';
import { Unauthorized } from '../errors';

export function authorizeRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user.admin) {
    throw new Unauthorized('Forbidden Endpoint: User not an Admin');
  }
  next();
}
