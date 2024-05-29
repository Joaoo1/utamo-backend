import { Insertable, Updateable } from 'kysely';
import { db } from '../../../database';
import { CalculationsTable } from '../../../database/types';

export class CalculationsRepository {
  async findAllByDrainageProject(drainageProjectId: string) {
    return await db
      .selectFrom('calculations')
      .where('drainageProjectId', '=', drainageProjectId)
      .selectAll()
      .execute();
  }

  async findById(id: string) {
    const calculation = await db
      .selectFrom('calculations')
      .where('calculations.id', '=', id)
      .innerJoin(
        'drainageProjects',
        'drainageProjects.id',
        'calculations.drainageProjectId'
      )
      .select([
        'calculations.id',
        'calculations.drainageId',
        'drainageProjects.companyId',
      ])
      .executeTakeFirst();

    if (!calculation) {
      return null;
    }

    return calculation;
  }

  async create(data: Insertable<CalculationsTable>) {
    await db.insertInto('calculations').values(data).execute();
  }

  async update(id: string, data: Updateable<CalculationsTable>) {
    await db
      .updateTable('calculations')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  async delete(id: string) {
    const result = await db
      .deleteFrom('calculations')
      .where('id', '=', id)
      .execute();

    return result[0]?.numDeletedRows > 0;
  }
}
