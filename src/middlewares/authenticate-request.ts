import type { Request, Response, NextFunction } from 'express';
import { Unauthenticated } from '../errors';
import { verifyToken } from '../utils/jwt.util';

export function authenticateRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith('Bearer ')) {
    throw new Unauthenticated(
      'Missing Token or Invalid Token: User not signed in.',
    );
  }

  try {
    const payload = verifyToken(authToken.split(' ')[1]);
    req.user = payload.user;

    next();
  } catch {
    throw new Unauthenticated('Invalid Token: Sign-in Invalid.');
  }
}
