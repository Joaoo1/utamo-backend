import { Router } from 'express';

import { ListDrainageProjectsController } from './useCases/ListDrainageProjectsController';
import { CreateDrainageProjectController } from './useCases/CreateDrainageProjectController';
import { UpdateDrainageProjectController } from './useCases/UpdateDrainageProjectController';
import { DeleteDrainageProjectController } from './useCases/DeleteDrainageProjectController';
import { CreateGutterController } from './useCases/CreateGutterController';
import { UpdateGutterController } from './useCases/UpdateGutterController';
import { DeleteGutterController } from './useCases/DeleteGutterController';

const drainageProjectRouter = Router();

const listDrainageProjectController = new ListDrainageProjectsController();
const createDrainageProjectController = new CreateDrainageProjectController();
const updateDrainageProjectController = new UpdateDrainageProjectController();
const deleteDrainageProjectController = new DeleteDrainageProjectController();
const createGutterController = new CreateGutterController();
const updateGutterController = new UpdateGutterController();
const deleteGutterController = new DeleteGutterController();

drainageProjectRouter.get('/', listDrainageProjectController.handle);
drainageProjectRouter.post('/', createDrainageProjectController.handle);
drainageProjectRouter.put('/:id', updateDrainageProjectController.handle);
drainageProjectRouter.delete('/:id', deleteDrainageProjectController.handle);

drainageProjectRouter.post('/:id/gutters', createGutterController.handle);
drainageProjectRouter.put(
  '/:id/gutters/:gutterId',
  updateGutterController.handle
);
drainageProjectRouter.delete(
  '/:id/gutters/:gutterId',
  deleteGutterController.handle
);

export { drainageProjectRouter };
