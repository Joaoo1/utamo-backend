import { Insertable, Updateable } from 'kysely';
import { db } from '../../../database';
import { GuttersTable } from '../../../database/types';

const defaultFindSelectFields = [
  'gutters.base',
  'gutters.slope',
  'gutters.maxHeight',
  'gutters.maxSpeed',
  'gutters.name',
  'gutters.roughness',
  'gutters.type',
  'gutters.createdAt',
  'gutters.updatedAt',
  'gutters.drainageProjectId',
  'gutters.id',
  'drainageProjects.id as drainageProjects.id',
  'drainageProjects.name as drainageProjects.name',
  'drainageProjects.companyId as drainageProjects.companyId',
] as const;

export class GuttersRepository {
  async listByProjectId(projectId: string) {
    return db
      .selectFrom('gutters')
      .where('drainageProjectId', '=', projectId)
      .selectAll()
      .execute();
  }

  async findByName(name: string, drainageProjectId: string) {
    const gutter = await db
      .selectFrom('gutters')
      .where('name', '=', name)
      .where('drainageProjectId', '=', drainageProjectId)
      .selectAll()
      .limit(1)
      .executeTakeFirst();

    return gutter ?? null;
  }

  async findById(id: string) {
    const gutter = await db
      .selectFrom('gutters')
      .innerJoin(
        'drainageProjects',
        'drainageProjects.id',
        'gutters.drainageProjectId'
      )
      .where('gutters.id', '=', id)
      .select(defaultFindSelectFields)
      .limit(1)
      .executeTakeFirst();

    if (!gutter) {
      return null;
    }

    return {
      base: gutter.base,
      slope: gutter.slope,
      maxHeight: gutter.maxHeight,
      maxSpeed: gutter.maxSpeed,
      name: gutter.name,
      roughness: gutter.roughness,
      type: gutter.type,
      createdAt: gutter.createdAt,
      updatedAt: gutter.updatedAt,
      drainageProjectId: gutter.drainageProjectId,
      id: gutter.id,
      drainageProject: {
        id: gutter['drainageProjects.id'],
        name: gutter['drainageProjects.name'],
        companyId: gutter['drainageProjects.companyId'],
      },
    };
  }

  async create(data: Insertable<GuttersTable>) {
    await db.insertInto('gutters').values(data).execute();
  }

  async update(id: string, data: Updateable<GuttersTable>) {
    await db.updateTable('gutters').set(data).where('id', '=', id).execute();
  }

  async delete(id: string) {
    const result = await db
      .deleteFrom('gutters')
      .where('id', '=', id)
      .execute();

    return result[0]?.numDeletedRows > 0;
  }
}
