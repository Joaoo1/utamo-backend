import { Router } from 'express';

import { CreateDrainageProjectController } from './useCases/CreateDrainageProjectController';
import { DeleteDrainageProjectController } from './useCases/DeleteDrainageProjectController';
import { ListDrainageProjectsController } from './useCases/ListDrainageProjectsController';

const drainageProjectRouter = Router();

const createDrainageProjectController = new CreateDrainageProjectController();
const deleteDrainageProjectController = new DeleteDrainageProjectController();
const listDrainageProjectController = new ListDrainageProjectsController();

drainageProjectRouter.get('/', listDrainageProjectController.handle);
drainageProjectRouter.post('/', createDrainageProjectController.handle);
drainageProjectRouter.delete('/:id', deleteDrainageProjectController.handle);

export { drainageProjectRouter };
