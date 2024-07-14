import { Expression, Insertable, Updateable, sql } from 'kysely';
import { Database } from '../../../database';
import { DrainageProjectsTable } from '../../../database/types';

const db = Database.getInstance();

function jsonbBuildObject<O extends Record<string, Expression<unknown>>>(
  obj: O
) {
  return sql`jsonb_build_object(${sql.join(
    Object.keys(obj).flatMap((k) => [sql.lit(k), obj[k]])
  )})`;
}

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

  async findByIdFullData(id: string, companyId: string) {
    const drainageProject = await db
      .selectFrom('drainageProjects')
      .where('id', '=', id)
      .where('companyId', '=', companyId)
      .select([
        'id',
        'name',
        'defaultConcentrationTime',
        'defaultRainIntensity',
        'createdAt',
      ])
      .executeTakeFirst();

    const basins = await db
      .selectFrom('basins')
      .where('drainageProjectId', '=', id)
      .select(['id', 'name', 'area', 'runoff', 'createdAt'])
      .execute();

    const basinIds = basins.map((basin) => basin.id);

    const basinLines = await db
      .selectFrom('lines')
      .where('basinId', 'in', basinIds)
      .select(['id', 'x1', 'x2', 'y1', 'y2', 'length', 'drainageId', 'basinId'])
      .execute();

    const drainages = await db
      .selectFrom('drainages')
      .where('drainageProjectId', '=', id)
      .select(['id', 'name', 'length', 'createdAt'])
      .execute();

    const drainageIds = drainages.map((drainage) => drainage.id);

    const drainageSections = await db
      .selectFrom('drainageSections')
      .where('drainageId', 'in', drainageIds)
      .select(['id', 'startsAt', 'endsAt', 'slope', 'drainageId'])
      .execute();

    const drainageLines = await db
      .selectFrom('lines')
      .where('drainageId', 'in', drainageIds)
      .select(['id', 'x1', 'x2', 'y1', 'y2', 'length', 'drainageId'])
      .execute();

    const gutters = await db
      .selectFrom('gutters')
      .where('drainageProjectId', '=', id)
      .select([
        'id',
        'base',
        'roughness',
        'maxHeight',
        'maxSpeed',
        'slope',
        'name',
        'color',
        'type',
        'createdAt',
      ])
      .execute();

    const basinsWithLines = basins.map((basin) => ({
      ...basin,
      lines: basinLines.filter((line) => line.basinId === basin.id),
    }));

    const drainagesWithDetails = drainages.map((drainage) => ({
      ...drainage,
      sections: drainageSections.filter(
        (section) => section.drainageId === drainage.id
      ),
      lines: drainageLines.filter((line) => line.drainageId === drainage.id),
    }));

    return {
      ...drainageProject,
      basins: basinsWithLines,
      drainages: drainagesWithDetails,
      gutters: gutters,
    };
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
    const [result] = await db
      .insertInto('drainageProjects')
      .values(data)
      .returningAll()
      .execute();

    return result;
  }

  async update(id: string, data: Updateable<DrainageProjectsTable>) {
    const [result] = await db
      .updateTable('drainageProjects')
      .set(data)
      .where('id', '=', id)
      .returningAll()
      .execute();

    return result;
  }

  async delete(id: string) {
    const result = await db
      .deleteFrom('drainageProjects')
      .where('id', '=', id)
      .execute();

    return result[0]?.numDeletedRows > 0;
  }
}
