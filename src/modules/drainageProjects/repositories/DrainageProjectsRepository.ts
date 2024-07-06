import {
  Expression,
  Insertable,
  RawBuilder,
  Simplify,
  Updateable,
  sql,
} from 'kysely';
import { Database } from '../../../database';
import { DrainageProjectsTable } from '../../../database/types';
import { jsonBuildObject } from 'kysely/helpers/postgres';

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
      .leftJoin(
        'drainages',
        'drainages.drainageProjectId',
        'drainageProjects.id'
      )
      .leftJoin('gutters', 'gutters.drainageProjectId', 'drainageProjects.id')
      .leftJoin('basins', 'basins.drainageProjectId', 'drainageProjects.id')
      .where('drainageProjects.id', '=', id)
      .where('companyId', '=', companyId)
      .select((eb) => [
        'drainageProjects.id',
        'drainageProjects.name',
        'drainageProjects.defaultConcentrationTime',
        'drainageProjects.defaultRainIntensity',
        'drainageProjects.createdAt',
        eb.fn
          .coalesce(
            eb.fn
              .jsonAgg(
                jsonbBuildObject({
                  id: eb.ref('basins.id'),
                  name: eb.ref('basins.name'),
                  area: eb.ref('basins.area'),
                  runoff: eb.ref('basins.runoff'),
                  createdAt: eb.ref('basins.createdAt'),
                  lines: eb.fn.coalesce(
                    db
                      .selectFrom('lines')
                      .select((eb1) => [
                        eb1.fn
                          .jsonAgg(
                            jsonBuildObject({
                              id: eb1.ref('lines.id'),
                              x1: eb1.ref('lines.x1'),
                              x2: eb1.ref('lines.x2'),
                              y1: eb1.ref('lines.y1'),
                              y2: eb1.ref('lines.y2'),
                              length: eb1.ref('lines.length'),
                              drainageId: eb1.ref('lines.drainageId'),
                            })
                          )
                          .as('lines'),
                      ])
                      .groupBy('lines.drainageId')
                      .where('lines.basinId', '=', eb.ref('basins.id')),
                    sql`'[]'`
                  ),
                })
              )
              .filterWhere('basins.id', 'is not', null)
              .distinct(),
            sql`'[]'`
          )
          .as('basins'),
        eb.fn
          .coalesce(
            eb.fn
              .jsonAgg(
                jsonbBuildObject({
                  id: eb.ref('drainages.id'),
                  name: eb.ref('drainages.name'),
                  length: eb.ref('drainages.length'),
                  sections: db
                    .selectFrom('drainageSections')
                    .select((eb1) => [
                      eb1.fn
                        .jsonAgg(
                          jsonBuildObject({
                            id: eb1.ref('drainageSections.id'),
                            startsAt: eb1.ref('drainageSections.startsAt'),
                            endsAt: eb1.ref('drainageSections.endsAt'),
                            slope: eb1.ref('drainageSections.slope'),
                          })
                        )
                        .as('drainages'),
                    ])
                    .groupBy('drainageSections.drainageId')
                    .where(
                      'drainageSections.drainageId',
                      '=',
                      eb.ref('drainages.id')
                    ),
                  lines: db
                    .selectFrom('lines')
                    .select((eb1) => [
                      eb1.fn
                        .jsonAgg(
                          jsonBuildObject({
                            id: eb1.ref('lines.id'),
                            x1: eb1.ref('lines.x1'),
                            x2: eb1.ref('lines.x2'),
                            y1: eb1.ref('lines.y1'),
                            y2: eb1.ref('lines.y2'),
                            length: eb1.ref('lines.length'),
                            drainageId: eb1.ref('lines.drainageId'),
                          })
                        )
                        .as('lines'),
                    ])
                    .groupBy('lines.drainageId')
                    .where('lines.drainageId', '=', eb.ref('drainages.id')),
                  createdAt: eb.ref('drainages.createdAt'),
                })
              )
              .filterWhere('drainages.id', 'is not', null)
              .distinct(),
            sql`'[]'`
          )
          .as('drainages'),
        eb.fn
          .coalesce(
            eb.fn
              .jsonAgg(
                jsonbBuildObject({
                  id: eb.ref('gutters.id'),
                  base: eb.ref('gutters.base'),
                  roughness: eb.ref('gutters.roughness'),
                  maxHeight: eb.ref('gutters.maxHeight'),
                  maxSpeed: eb.ref('gutters.maxSpeed'),
                  slope: eb.ref('gutters.slope'),
                  name: eb.ref('gutters.name'),
                  color: eb.ref('gutters.color'),
                  type: eb.ref('gutters.type'),
                  createdAt: eb.ref('gutters.createdAt'),
                })
              )
              .filterWhere('gutters.id', 'is not', null)
              .distinct(),
            sql`'[]'`
          )
          .as('gutters'),
      ])
      .groupBy(['drainageProjects.id'])
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
    return db
      .insertInto('drainageProjects')
      .values(data)
      .returningAll()
      .execute();
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
