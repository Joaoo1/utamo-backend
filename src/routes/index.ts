import { Router } from 'express';
import { db } from '../database';
import { authRouter } from '../modules/auth/router';

const router = Router();

router.use(authRouter);

export { router };
