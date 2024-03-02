import { Router } from 'express';
import { loginUser } from './auth.controller';

const router = Router();

router.get('/login', loginUser);

export default router;
