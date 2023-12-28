import { ErrorRequestHandler } from 'express';
import { ApplicationError } from '../errors';
import { StatusCodes } from 'http-status-codes';

export const globalErrorHandler: ErrorRequestHandler = function (
  err,
  req,
  res,
) {
  if (err instanceof ApplicationError) {
    res.status(err.statusCode).json({
      status: 'Failed',
      msg: err.message,
      data: err.data,
    });
    return;
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'Failed',
    data: err as object,
  });
};
