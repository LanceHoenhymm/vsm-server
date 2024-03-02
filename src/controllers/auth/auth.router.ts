import { Router } from 'express';
import { loginUser, registerUser } from './auth.controller';

export const authRouter = Router();

authRouter.post('/login', loginUser);
authRouter.post('/register', registerUser);
