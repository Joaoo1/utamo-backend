import { Insertable } from 'kysely';

import { Database } from '../../../database';
import { LinesTable } from '../../../database/types';

const db = Database.getInstance();

export class LinesRepository {
  async createAll(data: Insertable<LinesTable>[]) {
    await db.insertInto('lines').values(data).execute();
  }

  async deleteAllFromDrainage(drainageId: string) {
    const result = await db
      .deleteFrom('lines')
      .where('drainageId', '=', drainageId)
      .execute();

    return result[0]?.numDeletedRows > 0;
  }

  async deleteAllFromBasin(basinId: string) {
    const result = await db
      .deleteFrom('lines')
      .where('basinId', '=', basinId)
      .execute();

    return result[0]?.numDeletedRows > 0;
  }
}
