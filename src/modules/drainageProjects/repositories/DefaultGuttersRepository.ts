import { Insertable, Updateable } from 'kysely';
import { Database } from '../../../database';
import { DefaultGuttersTable } from '../../../database/types';

const db = Database.getInstance();

export class DefaultGuttersRepository {
  async listByCompanyId(companyId: string) {
    return db
      .selectFrom('defaultGutters')
      .where('companyId', '=', companyId)
      .selectAll()
      .execute();
  }

  async findByName(name: string, companyId: string) {
    const gutter = await db
      .selectFrom('defaultGutters')
      .where('name', '=', name)
      .where('companyId', '=', companyId)
      .selectAll()
      .limit(1)
      .executeTakeFirst();

    return gutter ?? null;
  }

  async findById(id: string) {
    const gutter = await db
      .selectFrom('defaultGutters')
      .where('id', '=', id)
      .selectAll()
      .limit(1)
      .executeTakeFirst();

    return gutter ?? null;
  }

  async create(data: Insertable<DefaultGuttersTable>) {
    const [result] = await db
      .insertInto('defaultGutters')
      .values(data)
      .returningAll()
      .execute();

    return result;
  }

  async update(id: string, data: Updateable<DefaultGuttersTable>) {
    const [result] = await db
      .updateTable('defaultGutters')
      .set(data)
      .where('id', '=', id)
      .returningAll()
      .execute();

    return result;
  }

  async delete(id: string) {
    const result = await db
      .deleteFrom('defaultGutters')
      .where('id', '=', id)
      .execute();

    return result[0]?.numDeletedRows > 0;
  }
}
