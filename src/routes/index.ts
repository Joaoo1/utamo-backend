import { Router } from 'express';
import { db } from '../database';

const router = Router();

router.get('/', async (_req, res) => {
  const result = await db.selectFrom('companies').selectAll().execute();
  return res.json({ result });
});

export { router };
