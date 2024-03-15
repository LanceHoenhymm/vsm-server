import type { ReqHandler } from '../../../types';
import { StatusCodes } from 'http-status-codes';

type InfoEndpointHandler = ReqHandler<object>;

export const getNews: InfoEndpointHandler = function (req, res) {
  res.status(StatusCodes.OK).json({
    status: 'Success',
    data: {},
  });
};

export const getStocks: InfoEndpointHandler = function (req, res) {
  res.status(StatusCodes.OK).json({
    status: 'Success',
    data: {},
  });
};

export const getLeaderboard: InfoEndpointHandler = function (req, res) {
  res.status(StatusCodes.OK).json({ status: 'Success', data: {} });
};

export const getGameInfo: InfoEndpointHandler = function (req, res) {
  res.status(StatusCodes.OK).json({
    status: 'Success',
    data: {},
  });
};

export const getProfile: InfoEndpointHandler = function (req, res) {
  res.status(StatusCodes.OK).json({
    status: 'Success',
    data: {},
  });
};

export const getPortfolio: InfoEndpointHandler = function (req, res) {
  res.status(StatusCodes.OK).json({
    status: 'Success',
    data: {},
  });
};

export const getBalence: InfoEndpointHandler = function (req, res) {
  res.status(StatusCodes.OK).json({
    status: 'Success',
    data: {},
  });
};
