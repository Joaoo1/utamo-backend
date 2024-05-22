import { Router } from 'express';

import { AuthenticateController } from './useCases/AuthenticateController';

const authRouter = Router();

const authenticateController = new AuthenticateController();

authRouter.post('/auth', authenticateController.handle);

export { authRouter };
