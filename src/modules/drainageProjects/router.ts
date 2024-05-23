import { Router } from 'express';

import { CreateDrainageProjectController } from './useCases/CreateDrainageProjectController';
import { DeleteDrainageProjectController } from './useCases/DeleteDrainageProjectController';

const drainageProjectRouter = Router();

const createDrainageProjectController = new CreateDrainageProjectController();
const deleteDrainageProjectController = new DeleteDrainageProjectController();

drainageProjectRouter.post('/', createDrainageProjectController.handle);
drainageProjectRouter.delete('/:id', deleteDrainageProjectController.handle);

export { drainageProjectRouter };
