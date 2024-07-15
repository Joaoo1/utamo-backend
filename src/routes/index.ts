import { Router } from 'express';
import { authRouter } from '../modules/auth/router';
import { drainageProjectRouter } from '../modules/drainageProjects/router';
import { EnsureAuthenticated } from '../middlewares/EnsureAuthenticated';
import { stiStationsRouter } from '../modules/StiStations/router';

const router = Router();

router.use('/api', authRouter);

router.use(EnsureAuthenticated);

router.use('/api/drainage-projects', drainageProjectRouter);
router.use('/api/sti-stations', stiStationsRouter);

export { router };
