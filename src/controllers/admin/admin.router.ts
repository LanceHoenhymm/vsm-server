import { Router } from 'express';
import { authorizeAdmin } from '@middlewares/authorizer.middleware';
import { validatorFactory } from '@/middlewares/validator.middleware';
import {
  addNewsRequestDtoSchema,
  addStockRequestDtoSchema,
} from './admin.controller.dto';
import { addNews, addStock } from './admin.controller';
import { controlRouter } from './control/control.router';

export const adminRouter = Router();

adminRouter.use(authorizeAdmin);
adminRouter.use('/control', controlRouter);
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
