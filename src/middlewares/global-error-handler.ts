import { ErrHandler } from '../types';
import { ApplicationError } from '../errors';
import { StatusCodes } from 'http-status-codes';

export const globalErrorHandler: ErrHandler = function (err, req, res) {
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
