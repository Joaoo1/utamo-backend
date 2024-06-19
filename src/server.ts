import { Database } from './database';

Database.init().then(() => {
  const app = require('./app').app;

  const port = process.env.PORT;

  if (!port) {
    throw new Error('Please add PORT field to .env file');
  }

  app.listen(port, () => {
    console.log(`Server listen on ${port}`);
  });
});
