import type { ErrHandler } from '../types';
import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from '../errors/index';

export const globalErrorHandler: ErrHandler = function (err, req, res, _next) {
  if (err instanceof ApplicationError) {
    res.status(err.statusCode).json({
      status: 'Failure',
      data: err,
    });
    return;
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'Failure',
    data: err as object,
  });
};
