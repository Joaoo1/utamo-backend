import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('basins')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('area', 'numeric', (col) => col.notNull())
    .addColumn('runoff', 'numeric', (col) => col.notNull())
    .addColumn('drainageProjectId', 'uuid', (col) =>
      col.references('drainageProjects.id').notNull()
    )
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updatedAt', 'timestamp')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('basins').execute();
}
