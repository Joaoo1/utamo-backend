import { createServer } from 'node:http';

import { Database } from './database';
import { ensureWebsocketAuthentication } from './libs/ws/middlewares';

Database.init().then(() => {
  const app = require('./app').app;

  const port = process.env.PORT;

  if (!port) {
    throw new Error('Please add PORT field to .env file');
  }

  const server = createServer(app);

  server.on('upgrade', ensureWebsocketAuthentication);

  server.listen(port, () => {
    console.log(`Server listen on ${port}`);
  });
});
