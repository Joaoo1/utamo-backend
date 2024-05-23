import { Router } from 'express';

import { ListDrainageProjectsController } from './useCases/ListDrainageProjectsController';
import { CreateDrainageProjectController } from './useCases/CreateDrainageProjectController';
import { UpdateDrainageProjectController } from './useCases/UpdateDrainageProjectController';
import { DeleteDrainageProjectController } from './useCases/DeleteDrainageProjectController';

const drainageProjectRouter = Router();

const listDrainageProjectController = new ListDrainageProjectsController();
const createDrainageProjectController = new CreateDrainageProjectController();
const updateDrainageProjectController = new UpdateDrainageProjectController();
const deleteDrainageProjectController = new DeleteDrainageProjectController();

drainageProjectRouter.get('/', listDrainageProjectController.handle);
drainageProjectRouter.post('/', createDrainageProjectController.handle);
drainageProjectRouter.put('/:id', updateDrainageProjectController.handle);
drainageProjectRouter.delete('/:id', deleteDrainageProjectController.handle);

export { drainageProjectRouter };
