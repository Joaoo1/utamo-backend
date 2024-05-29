import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('calculations')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('qMin', 'numeric', (col) => col.notNull().defaultTo(0))
    .addColumn('qMax', 'numeric', (col) => col.notNull().defaultTo(0))
    .addColumn('gap', 'numeric', (col) => col.notNull().defaultTo(0))
    .addColumn('amMax', 'numeric', (col) => col.notNull().defaultTo(0))
    .addColumn('amMin', 'numeric', (col) => col.notNull().defaultTo(0))
    .addColumn('pmMax', 'numeric', (col) => col.notNull().defaultTo(0))
    .addColumn('pmMin', 'numeric', (col) => col.notNull().defaultTo(0))
    .addColumn('rhMax', 'numeric', (col) => col.notNull().defaultTo(0))
    .addColumn('rhMin', 'numeric', (col) => col.notNull().defaultTo(0))
    .addColumn('hnMax', 'numeric', (col) => col.notNull().defaultTo(0))
    .addColumn('hnMin', 'numeric', (col) => col.notNull().defaultTo(0))
    .addColumn('velocity', 'numeric', (col) => col.notNull().defaultTo(0))
    .addColumn('projectFlow', 'numeric', (col) => col.notNull().defaultTo(0))
    .addColumn('deviceLength', 'numeric', (col) => col.notNull())
    .addColumn('minSlope', 'numeric', (col) => col.notNull().defaultTo(0))
    .addColumn('maxSlope', 'numeric', (col) => col.notNull().defaultTo(0))
    .addColumn('basinsTotalArea', 'numeric', (col) => col.notNull())
    .addColumn('runOff', 'numeric', (col) => col.notNull().defaultTo(0))
    .addColumn('startStationInt', 'integer', (col) => col.notNull())
    .addColumn('startStationDecimal', 'numeric', (col) => col.notNull())
    .addColumn('endStationInt', 'varchar', (col) => col.notNull())
    .addColumn('endStationDecimal', 'numeric', (col) => col.notNull())
    .addColumn('rainIntensity', 'numeric', (col) => col.notNull())
    .addColumn('concentrationTime', 'numeric', (col) => col.notNull())
    .addColumn('gutterId', 'uuid', (col) =>
      col.references('gutters.id').notNull()
    )
    .addColumn('drainageId', 'uuid', (col) =>
      col.references('drainages.id').notNull()
    )
    .addColumn('drainageProjectId', 'uuid', (col) =>
      col.references('drainageProjects.id').notNull()
    )
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updatedAt', 'timestamp')
    .execute();

  await db.schema
    .createTable('calculationsBasins')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('calculationId', 'uuid', (col) =>
      col.references('calculations.id').notNull()
    )
    .addColumn('basinId', 'uuid', (col) =>
      col.references('basins.id').notNull()
    )
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('calculationsBasins').execute();
  await db.schema.dropTable('calculations').execute();
}
