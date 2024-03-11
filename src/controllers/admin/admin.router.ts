import { Router } from 'express';
import { validatorFactory } from '../../middlewares/validator-factory.js';
import {
  addNewsRequestDtoSchema,
  addStockRequestDtoSchema,
} from './admin.controller.dto.js';
import { addNews, addStock } from './admin.controller.js';

export const adminRouter = Router();

adminRouter.post(
  '/add-news',
  validatorFactory(addNewsRequestDtoSchema),
  addNews,
);
adminRouter.post(
  '/add-stock',
  validatorFactory(addStockRequestDtoSchema),
  addStock,
);
