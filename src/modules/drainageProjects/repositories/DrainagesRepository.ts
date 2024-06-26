import { Insertable, Updateable } from 'kysely';
import { Database } from '../../../database';
import { DrainagesTable } from '../../../database/types';

const db = Database.getInstance();

export class DrainagesRepository {
  async findById(id: string) {
    const drainage = await db
      .selectFrom('drainages')
      .where('drainages.id', '=', id)
      .innerJoin(
        'drainageProjects',
        'drainageProjects.id',
        'drainages.drainageProjectId'
      )
      .limit(1)
      .select([
        'drainages.id',
        'drainages.name',
        'drainages.length',
        'drainageProjects.companyId',
      ])
      .executeTakeFirst();

    if (!drainage) {
      return null;
    }

    return drainage;
  }

  async findAllByNames(names: string[], drainageProjectId: string) {
    return await db
      .selectFrom('drainages')
      .selectAll()
      .where('drainageProjectId', '=', drainageProjectId)
      .where('name', 'in', names)
      .execute();
  }

  async findByIdWithSections(id: string) {
    const result = await db
      .selectFrom('drainages')
      .innerJoin(
        'drainageSections',
        'drainages.id',
        'drainageSections.drainageId'
      )
      .where('drainages.id', '=', id)
      .select([
        'drainages.id as drainageId',
        'drainages.name as drainageName',
        'drainages.length as drainageLength',
        'drainageSections.id as drainageSectionId',
        'drainageSections.slope as drainageSectionSlope',
        'drainageSections.startsAt as drainageSectionStartsAt',
        'drainageSections.endsAt as drainageSectionEndsAt',
      ])
      .execute();

    if (result.length === 0) {
      return null;
    }

    const sections = result.map((row) => ({
      id: row.drainageSectionId,
      slope: row.drainageSectionSlope,
      startsAt: row.drainageSectionStartsAt,
      endsAt: row.drainageSectionEndsAt,
    }));

    return {
      id: result[0].drainageId,
      name: result[0].drainageName,
      length: result[0].drainageLength,
      sections,
    };
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
