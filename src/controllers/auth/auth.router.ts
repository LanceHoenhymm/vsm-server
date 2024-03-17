import { Router } from 'express';
import { blockOnInvalid } from '@middlewares/block-requests.middleware';
import { validatorFactory } from '@middlewares/validator.middleware';
import {
  loginUserDtoSchema,
  registerUserDtoSchema,
} from './auth.controller.dto';
import { loginAdmin, loginUser, registerUser } from './auth.controller';

export const authRouter = Router();

authRouter.post(
  '/login',
  blockOnInvalid,
  validatorFactory(loginUserDtoSchema),
  loginUser,
);
authRouter.post(
  '/login-admin',
  validatorFactory(loginUserDtoSchema),
  loginAdmin,
);
authRouter.post(
  '/register',
  validatorFactory(registerUserDtoSchema),
  registerUser,
);
