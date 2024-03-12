import type { Request, Response, NextFunction } from 'express';
import type { Socket } from 'socket.io';
import { Unauthenticated } from '../errors/index.js';
import { verifyToken } from '../common/utils.js';

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

export function authenticateSocket(
  socket: Socket,
  next: (err?: Error & { data?: object }) => void,
) {
  const token = (socket.handshake.headers['authorization'] ?? '').split(' ')[1];
  try {
    verifyToken(token);
  } catch {
    next(new Error('Invalid Token'));
    return;
  }
  next();
}
