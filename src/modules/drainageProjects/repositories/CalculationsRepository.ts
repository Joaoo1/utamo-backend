import { Insertable, Updateable, sql } from 'kysely';
import { jsonBuildObject } from 'kysely/helpers/postgres';

import { Database } from '../../../database';
import {
  CalculationsBasinsTable,
  CalculationsTable,
} from '../../../database/types';
import { calculate } from '../utils/calculate';

const db = Database.getInstance();

export class CalculationsRepository {
  async findAllByDrainageProject(drainageProjectId: string) {
    return db
      .selectFrom('calculations')
      .where('drainageProjectId', '=', drainageProjectId)
      .selectAll()
      .execute();
  }

  async findAllByDrainageProjectWithFullData(drainageProjectId: string) {
    return db
      .selectFrom('calculations')
      .where('calculations.drainageProjectId', '=', drainageProjectId)
      .leftJoin(
        'calculationsBasins',
        'calculationsBasins.calculationId',
        'calculations.id'
      )
      .leftJoin('basins', 'basins.id', 'calculationsBasins.basinId')
      .select((eb) => [
        'calculations.id',
        'calculations.createdAt',
        'calculations.updatedAt',
        'calculations.qMin',
        'calculations.qMax',
        'calculations.gap',
        'calculations.amMax',
        'calculations.amMin',
        'calculations.pmMax',
        'calculations.pmMin',
        'calculations.rhMax',
        'calculations.rhMin',
        'calculations.hnMax',
        'calculations.hnMin',
        'calculations.velocity',
        'calculations.projectFlow',
        'calculations.deviceLength',
        'calculations.minSlope',
        'calculations.maxSlope',
        'calculations.basinsTotalArea',
        'calculations.runOff',
        'calculations.startStationInt',
        'calculations.startStationDecimal',
        'calculations.endStationInt',
        'calculations.endStationDecimal',
        'calculations.rainIntensity',
        'calculations.concentrationTime',
        'calculations.gutterId',
        'calculations.drainageProjectId',
        'calculations.drainageId',
        eb.fn
          .coalesce(
            eb.fn
              .jsonAgg(
                jsonBuildObject({
                  id: eb.ref('basins.id'),
                  name: eb.ref('basins.name'),
                  area: eb.ref('basins.area'),
                  runOff: eb.ref('basins.runoff'),
                })
              )
              .filterWhere('basins.id', 'is not', null),
            sql`'[]'`
          )
          .as('basins'),
      ])
      .groupBy('calculations.id')
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
      .limit(1)
      .executeTakeFirst();

    if (!calculation) {
      return null;
    }

    return calculation;
  }

  async create(data: Insertable<CalculationsTable> & { basinsIds: string[] }) {
    const { basinsIds, ...calculationData } = data;
    const [result] = await db
      .insertInto('calculations')
      .values(calculationData)
      .returningAll()
      .execute();

    const calculationsBasins: Insertable<CalculationsBasinsTable>[] =
      basinsIds.map((basinId) => ({
        calculationId: result.id,
        basinId,
        id: sql`gen_random_uuid()`,
      }));

    await db
      .insertInto('calculationsBasins')
      .values(calculationsBasins)
      .execute();

    return result;
  }

  async update(
    id: string,
    data: Updateable<CalculationsTable> & { basinsIds: string[] }
  ) {
    const { basinsIds, ...calculationData } = data;
    await db
      .updateTable('calculations')
      .set(calculationData)
      .where('id', '=', id)
      .execute();

    await db
      .deleteFrom('calculationsBasins')
      .where('calculationId', '=', id)
      .execute();

    const calculationsBasins: Insertable<CalculationsBasinsTable>[] =
      basinsIds.map((basinId) => ({
        calculationId: id,
        basinId,
        id: sql`gen_random_uuid()`,
      }));

    await db
      .insertInto('calculationsBasins')
      .values(calculationsBasins)
      .execute();
  }

  async delete(id: string) {
    const result = await db
      .deleteFrom('calculations')
      .where('id', '=', id)
      .execute();

    return result[0]?.numDeletedRows > 0;
  }

  async deleteByDrainageProjectId(drainageProjectId: string) {
    await db
      .deleteFrom('calculations')
      .where('drainageProjectId', '=', drainageProjectId)
      .execute();
  }

  async recalculate(id: string) {
    const calculation = await db
      .selectFrom('calculations')
      .innerJoin('drainages', 'drainages.id', 'calculations.drainageId')
      .innerJoin('gutters', 'gutters.id', 'calculations.gutterId')
      .innerJoin(
        'calculationsBasins',
        'calculations.id',
        'calculationsBasins.calculationId'
      )
      .innerJoin('basins', 'basins.id', 'calculationsBasins.basinId')
      .innerJoin(
        'drainageSections',
        'drainageSections.drainageId',
        'drainages.id'
      )
      .select((eb) => [
        'calculations.id',
        'calculations.rainIntensity',
        'calculations.concentrationTime',
        'calculations.startStationInt',
        'calculations.startStationDecimal',
        'calculations.endStationInt',
        'calculations.endStationDecimal',
        jsonBuildObject({
          id: eb.ref('gutters.id'),
          base: eb.ref('gutters.base'),
          roughness: eb.ref('gutters.roughness'),
          maxHeight: eb.ref('gutters.maxHeight'),
          slope: eb.ref('gutters.slope'),
        }).as('gutter'),
        eb.fn
          .jsonAgg(
            jsonBuildObject({
              id: eb.ref('basins.id'),
              runoff: eb.ref('basins.runoff'),
              area: eb.ref('basins.area'),
            })
          )
          .as('basins'),
        eb.fn
          .jsonAgg(
            jsonBuildObject({
              id: eb.ref('drainageSections.id'),
              startsAt: eb.ref('drainageSections.startsAt'),
              endsAt: eb.ref('drainageSections.endsAt'),
              slope: eb.ref('drainageSections.slope'),
            })
          )
          .as('sections'),
      ])
      .where('calculations.id', '=', id)
      .groupBy(['calculations.id', 'gutters.id'])
      .limit(1)
      .executeTakeFirst();

    if (!calculation) return;

    const uniqueBasins: any = {};
    calculation.basins.forEach((b) => {
      uniqueBasins[b.id] = b;
    });
    calculation.basins = Object.values(uniqueBasins);

    const uniqueSections: any = {};
    calculation.sections.forEach((b) => {
      uniqueSections[b.id] = b;
    });
    calculation.sections = Object.values(uniqueSections);

    const result = calculate({
      basins: calculation.basins,
      drainageSections: calculation.sections,
      gutter: calculation.gutter,
      concentrationTime: calculation.concentrationTime,
      rainIntensity: calculation.rainIntensity,
      startEnd: {
        start: {
          int: calculation.startStationInt,
          decimal: calculation.startStationDecimal,
        },
        end: {
          int: calculation.endStationInt,
          decimal: calculation.endStationDecimal,
        },
      },
    });

    await db
      .updateTable('calculations')
      .set({ ...result, updatedAt: new Date() })
      .where('id', '=', id)
      .execute();
  }

  async findAllCalculationsByGutterId(gutterId: string) {
    return db
      .selectFrom('calculations')
      .where('gutterId', '=', gutterId)
      .selectAll()
      .execute();
  }

  async findAllCalculationsByBasinId(basinId: string) {
    return db
      .selectFrom('calculations')
      .innerJoin(
        'calculationsBasins',
        'calculations.id',
        'calculationsBasins.calculationId'
      )
      .where('calculationsBasins.basinId', '=', basinId)
      .selectAll()
      .execute();
  }

  async findAllCalculationsByDrainageId(drainageId: string) {
    return db
      .selectFrom('calculations')
      .where('drainageId', '=', drainageId)
      .selectAll()
      .execute();
  }
}
