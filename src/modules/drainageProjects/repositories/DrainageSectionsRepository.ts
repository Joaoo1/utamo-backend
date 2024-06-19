import { Insertable, Updateable } from 'kysely';
import { Database } from '../../../database';
import { DrainageSectionsTable } from '../../../database/types';

const db = Database.getInstance();

export class DrainageSectionsRepository {
  async createAll(data: Insertable<DrainageSectionsTable>[]) {
    await db.insertInto('drainageSections').values(data).execute();
  }

  async update(id: string, data: Updateable<DrainageSectionsTable>) {
    await db
      .updateTable('drainageSections')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  async deleteAllFromDrainage(drainageId: string) {
    const result = await db
      .deleteFrom('drainageSections')
      .where('drainageId', '=', drainageId)
      .execute();

    return result[0]?.numDeletedRows > 0;
  }
}
