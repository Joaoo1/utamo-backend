import { Insertable, Updateable } from 'kysely';
import { db } from '../../../database';
import { BasinsTable } from '../../../database/types';

export class BasinsRepository {
  async findAllByName(names: string[], drainageProjectId: string) {
    return await db
      .selectFrom('basins')
      .selectAll()
      .where('name', 'in', names)
      .where('drainageProjectId', '=', drainageProjectId)
      .execute();
  }

  async findAllByIds(ids: string[], drainageProjectId: string) {
    return await db
      .selectFrom('basins')
      .selectAll()
      .where('id', 'in', ids)
      .where('drainageProjectId', '=', drainageProjectId)
      .execute();
  }

  async create(data: Insertable<BasinsTable>) {
    await db.insertInto('basins').values(data).execute();
  }

  async update(id: string, data: Updateable<BasinsTable>) {
    await db.updateTable('basins').set(data).where('id', '=', id).execute();
  }

  async delete(id: string) {
    const result = await db.deleteFrom('basins').where('id', '=', id).execute();

    return result[0]?.numDeletedRows > 0;
  }
}
