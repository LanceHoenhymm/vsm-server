import { Router } from 'express';
import { loginUser } from './auth.controller';

export const authRouter = Router();

authRouter.post('/login', loginUser);
authRouter.post('/login', loginUser);
