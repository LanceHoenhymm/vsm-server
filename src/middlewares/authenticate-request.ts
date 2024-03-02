import type { Request, Response, NextFunction } from 'express';
import { Unauthenticated } from '../errors';
import { verifyToken } from '../common/utils';

export function authenticateRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith('Bearer ')) {
    throw new Unauthenticated('Invalid or Missing Token');
  }

  try {
    const payload = verifyToken(authToken.split(' ')[1]);
    req.player = { teamId: payload.teamId, admin: payload.admin };

    next();
  } catch {
    throw new Unauthenticated('Invalid Token');
  }
}
