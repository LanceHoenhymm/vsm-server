import type { Request, Response, NextFunction } from 'express';
import { ServiceUnavailable } from '@errors/index';
import { getGameState } from '@game/game';

export function blockOnNotOpen(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (getGameState().stage != 'OPEN') {
    throw new ServiceUnavailable(
      'Not Accepting Requests: Game is not in Trading Stage',
    );
  }
  next();
}

export function blockOnNotOn(req: Request, res: Response, next: NextFunction) {
  const stage = getGameState().stage;
  if (stage === 'INVALID' || stage === 'OFF') {
    throw new ServiceUnavailable(
      'Not Accepting Requests: Game is not in Trading Stage',
    );
  }
  next();
}

export function blockOnInvalid(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (getGameState().stage === 'INVALID') {
    throw new ServiceUnavailable(
      'Not Accepting Requests: Game is in Invalid Stage',
    );
  }
  next();
}
