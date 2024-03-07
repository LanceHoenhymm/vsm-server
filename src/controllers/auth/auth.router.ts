import { Router } from 'express';
import { validatorFactory } from '../../middlewares/validator-factory.js';
import {
  loginUserDtoSchema,
  registerUserDtoSchema,
} from './auth.controller.dto.js';
import { loginUser, registerUser } from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/login', validatorFactory(loginUserDtoSchema), loginUser);
authRouter.post(
  '/register',
  validatorFactory(registerUserDtoSchema),
  registerUser,
);
