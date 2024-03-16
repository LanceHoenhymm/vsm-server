import { Router } from 'express';
import { validatorFactory } from '@/middlewares/validator.middleware';
import {
  addNewsRequestDtoSchema,
  addStockRequestDtoSchema,
} from './admin.controller.dto';
import { addNews, addStock } from './admin.controller';

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
