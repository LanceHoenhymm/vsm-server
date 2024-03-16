import type { RequestHandler } from 'express';
import { NotFound } from '@errors/index';

export const notFoundHandler: RequestHandler = function (req, res) {
  throw new NotFound('Resource Not Found');
};
