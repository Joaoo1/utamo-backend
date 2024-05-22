import { Router } from 'express';

import { CreateDrainageProjectController } from './useCases/CreateDrainageProjectController';

const drainageProjectRouter = Router();

const createDrainageProjectController = new CreateDrainageProjectController();

drainageProjectRouter.post('/', createDrainageProjectController.handle);

export { drainageProjectRouter };
