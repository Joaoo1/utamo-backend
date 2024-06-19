import { Insertable, Updateable } from 'kysely';

import { Database } from '../../../database';
import { BasinsTable } from '../../../database/types';

const db = Database.getInstance();

export class BasinsRepository {
  async findById(id: string) {
    const basin = await db
      .selectFrom('basins')
      .where('basins.id', '=', id)
      .innerJoin(
        'drainageProjects',
        'drainageProjects.id',
        'basins.drainageProjectId'
      )
      .select([
        'basins.id',
        'basins.name',
        'basins.area',
        'basins.runoff',
        'basins.drainageProjectId',
        'drainageProjects.companyId',
      ])
      .limit(1)
      .executeTakeFirst();

    if (!basin) {
      return null;
    }

    return basin;
  }

  async findByName(name: string, drainageProjectId: string) {
    const basin = await db
      .selectFrom('basins')
      .where('name', '=', name)
      .where('drainageProjectId', '=', drainageProjectId)
      .selectAll()
      .limit(1)
      .executeTakeFirst();

    return basin ?? null;
  }

  async findAllByNames(names: string[], drainageProjectId: string) {
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
    const [result] = await db
      .updateTable('basins')
      .set(data)
      .where('id', '=', id)
      .returningAll()
      .execute();

    return result;
  }

  async updateByDrainageProject(
    drainageProjectId: string,
    data: Updateable<BasinsTable>
  ) {
    await db
      .updateTable('basins')
      .set(data)
      .where('drainageProjectId', '=', drainageProjectId)
      .execute();
  }

  async delete(id: string) {
    const result = await db.deleteFrom('basins').where('id', '=', id).execute();

    return result[0]?.numDeletedRows > 0;
  }
}
