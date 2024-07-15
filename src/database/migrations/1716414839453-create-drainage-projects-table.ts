import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  db.schema
    .createTable('drainageProjects')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('baseX', 'varchar(255)', (col) => col.notNull().defaultTo(''))
    .addColumn('baseY', 'varchar(255)', (col) => col.notNull().defaultTo(''))
    .addColumn('defaultRainIntensity', 'decimal', (col) => col.notNull())
    .addColumn('defaultConcentrationTime', 'decimal', (col) => col.notNull())
    .addColumn('companyId', 'uuid', (col) =>
      col.references('companies.id').notNull()
    )
    .addColumn('createdBy', 'uuid', (col) =>
      col.references('users.id').notNull()
    )
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updatedAt', 'timestamp')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('drainageProjects').execute();
}
