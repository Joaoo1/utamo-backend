import { Router } from 'express';

import { ListDrainageProjectsController } from './useCases/ListDrainageProjectsController';
import { CreateDrainageProjectController } from './useCases/CreateDrainageProjectController';
import { UpdateDrainageProjectController } from './useCases/UpdateDrainageProjectController';
import { DeleteDrainageProjectController } from './useCases/DeleteDrainageProjectController';
import { CreateGutterController } from './useCases/CreateGutterController';
import { UpdateGutterController } from './useCases/UpdateGutterController';
import { DeleteGutterController } from './useCases/DeleteGutterController';
import { UpdateBasinController } from './useCases/UpdateBasinController';
import { DeleteBasinController } from './useCases/DeleteBasinController';
import { ImportDrainageProjectDataFromXmlController } from './useCases/ImportDrainageProjectDataFromXmlController';
import { DeleteDrainageController } from './useCases/DeleteDrainageController';
import { CreateCalculationController } from './useCases/CreateCalculationController';
import { DeleteCalculationController } from './useCases/DeleteCalculationController';
import { UpdateCalculationUseController } from './useCases/UpdateCalculationUseController';
import { UpdateDrainageController } from './useCases/UpdateDrainageController';
import { UpdateBasinRunoffController } from './useCases/UpdateBasinsRunoffController';

const drainageProjectRouter = Router();

const listDrainageProjectController = new ListDrainageProjectsController();
const createDrainageProjectController = new CreateDrainageProjectController();
const updateDrainageProjectController = new UpdateDrainageProjectController();
const deleteDrainageProjectController = new DeleteDrainageProjectController();
const updateDrainageController = new UpdateDrainageController();
const deleteDrainageController = new DeleteDrainageController();
const createGutterController = new CreateGutterController();
const updateGutterController = new UpdateGutterController();
const deleteGutterController = new DeleteGutterController();
const updateBasinController = new UpdateBasinController();
const deleteBasinController = new DeleteBasinController();
const updateBasinsRunoffController = new UpdateBasinRunoffController();
const createCalculationController = new CreateCalculationController();
const updateCalculationController = new UpdateCalculationUseController();
const deleteCalculationController = new DeleteCalculationController();
const importDrainageProjectDataFromXmlController =
  new ImportDrainageProjectDataFromXmlController();

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

drainageProjectRouter.put(
  '/:id/drainages/:drainageId',
  updateDrainageController.handle
);
drainageProjectRouter.delete(
  '/:id/drainages/:drainageId',
  deleteDrainageController.handle
);

drainageProjectRouter.put('/:id/basins/:basinId', updateBasinController.handle);
drainageProjectRouter.patch(
  '/:id/basins/:basinId/apply-runoff-to-all',
  updateBasinsRunoffController.handle
);
drainageProjectRouter.delete(
  '/:id/basins/:basinId',
  deleteBasinController.handle
);

drainageProjectRouter.post(
  '/:id/import-data',
  importDrainageProjectDataFromXmlController.handle
);

drainageProjectRouter.post(
  '/:id/calculation',
  createCalculationController.handle
);
drainageProjectRouter.put(
  '/:id/calculation/:calculationId',
  updateCalculationController.handle
);
drainageProjectRouter.delete(
  '/:id/calculation/:calculationId',
  deleteCalculationController.handle
);

export { drainageProjectRouter };
