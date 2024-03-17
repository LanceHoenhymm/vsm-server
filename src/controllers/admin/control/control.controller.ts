import type { ReqHandler } from '@/types';
import { StatusCodes } from 'http-status-codes';

type ControlEndpointHandler = ReqHandler<object>;

export const startGameHandler: ControlEndpointHandler = function (req, res) {
  res.status(StatusCodes.OK).json({
    status: 'Success',
    data: {},
  });
};

export const startRoundHandler: ControlEndpointHandler = function (req, res) {
  res.status(StatusCodes.OK).json({
    status: 'Success',
    data: {},
  });
};

export const terminateGameHandler: ControlEndpointHandler = function (
  req,
  res,
) {
  res.status(StatusCodes.OK).json({
    status: 'Success',
    data: {},
  });
};
