import 'dotenv/config';

import Express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from './routes';

const app = Express();

app.use(helmet());
app.use(cors());
app.use(router);

export { app };
