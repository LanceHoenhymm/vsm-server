import { Router } from 'express';
import { validatorFactory } from '@middlewares/validator.middleware';
import {
  loginUserDtoSchema,
  registerUserDtoSchema,
} from './auth.controller.dto';
import { loginUser, registerUser } from './auth.controller';

export const authRouter = Router();

authRouter.post('/login', validatorFactory(loginUserDtoSchema), loginUser);
authRouter.post(
  '/register',
  validatorFactory(registerUserDtoSchema),
  registerUser,
);
