import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('drainages')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('length', 'numeric', (col) => col.notNull())
    .addColumn('drainageProjectId', 'uuid', (col) =>
      col
        .references('drainageProjects.id')
        .notNull()
        .onDelete('cascade')
        .onUpdate('cascade')
    )
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updatedAt', 'timestamp')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('drainages').execute();
}
