import { Router } from 'express';
import { db } from '../database';
import { authRouter } from '../modules/auth/router';
import { drainageProjectRouter } from '../modules/drainageProjects/router';
import { EnsureAuthenticated } from '../middlewares/EnsureAuthenticated';

const router = Router();

router.use('/api', authRouter);

router.use(EnsureAuthenticated);

router.use('/api/drainage-projects', drainageProjectRouter);

export { router };
