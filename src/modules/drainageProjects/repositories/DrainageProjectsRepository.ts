import { InsertExpression } from 'kysely/dist/cjs/parser/insert-values-parser';
import { db } from '../../../database';
import { Database } from '../../../database/types';

export class DrainageProjectsRepository {
  async findById(id: string) {
    const drainageProject = await db
      .selectFrom('drainageProjects')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return drainageProject ?? null;
  }

  async findByName(name: string) {
    const drainageProject = await db
      .selectFrom('drainageProjects')
      .where('name', '=', name)
      .selectAll()
      .executeTakeFirst();

    return drainageProject ?? null;
  }

  async listByCompanyId(companyId: string) {
    return db
      .selectFrom('drainageProjects')
      .where('companyId', '=', companyId)
      .selectAll()
      .execute();
  }

  async create(data: InsertExpression<Database, 'drainageProjects'>) {
    await db.insertInto('drainageProjects').values(data).execute();
  }

  async delete(id: string) {
    const result = await db
      .deleteFrom('drainageProjects')
      .where('id', '=', id)
      .execute();

    return result[0]?.numDeletedRows > 0;
  }
}
