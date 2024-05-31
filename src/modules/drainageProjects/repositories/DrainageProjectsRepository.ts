import { Insertable, Updateable } from 'kysely';
import { db } from '../../../database';
import { DrainageProjectsTable } from '../../../database/types';

export class DrainageProjectsRepository {
  async findById(id: string) {
    const drainageProject = await db
      .selectFrom('drainageProjects')
      .where('id', '=', id)
      .selectAll()
      .limit(1)
      .executeTakeFirst();

    return drainageProject ?? null;
  }

  async findByName(name: string, companyId: string, idToIgnore?: string) {
    const query = db
      .selectFrom('drainageProjects')
      .where('name', '=', name)
      .where('companyId', '=', companyId);

    if (idToIgnore) {
      query.where('id', '!=', idToIgnore);
    }

    const drainageProject = await query.selectAll().limit(1).executeTakeFirst();

    return drainageProject ?? null;
  }

  async listByCompanyId(companyId: string) {
    return db
      .selectFrom('drainageProjects')
      .where('companyId', '=', companyId)
      .selectAll()
      .execute();
  }

  async create(data: Insertable<DrainageProjectsTable>) {
    await db.insertInto('drainageProjects').values(data).execute();
  }

  async update(id: string, data: Updateable<DrainageProjectsTable>) {
    await db
      .updateTable('drainageProjects')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  async delete(id: string) {
    const result = await db
      .deleteFrom('drainageProjects')
      .where('id', '=', id)
      .execute();

    return result[0]?.numDeletedRows > 0;
  }
}
