import 'dotenv/config';

import Express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import 'express-async-errors';

import { router } from './routes';
import { ErrorHandler } from './middlewares/ErrorHandler';

const app = Express();

app.use(helmet());
app.use(cors());
app.use(Express.json());
app.use(router);

app.use(ErrorHandler);

export { app };
