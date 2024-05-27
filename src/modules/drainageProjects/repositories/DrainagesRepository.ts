import { Insertable, Updateable } from 'kysely';
import { db } from '../../../database';
import { DrainagesTable } from '../../../database/types';

export class DrainagesRepository {
  async selectAllByName(names: string[], drainageProjectId: string) {
    return await db
      .selectFrom('drainages')
      .selectAll()
      .where('drainageProjectId', '=', drainageProjectId)
      .where('name', 'in', names)
      .execute();
  }

  async create(data: Insertable<DrainagesTable>) {
    await db.insertInto('drainages').values(data).execute();
  }

  async update(id: string, data: Updateable<DrainagesTable>) {
    await db.updateTable('drainages').set(data).where('id', '=', id).execute();
  }

  async delete(id: string) {
    const result = await db
      .deleteFrom('drainages')
      .where('id', '=', id)
      .execute();

    return result[0]?.numDeletedRows > 0;
  }
}
