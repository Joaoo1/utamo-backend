import { Router } from 'express';
import { AnalyzeStiStationsController } from './useCases/AnalyzeStiStationsController';

const stiStationsRouter = Router();

const analyzeStiStationsController = new AnalyzeStiStationsController();

stiStationsRouter.post('/analyze', analyzeStiStationsController.handle);

export { stiStationsRouter };
