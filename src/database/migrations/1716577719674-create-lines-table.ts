import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('lines')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('x1', 'numeric', (col) => col.notNull())
    .addColumn('y1', 'numeric', (col) => col.notNull())
    .addColumn('x2', 'numeric', (col) => col.notNull())
    .addColumn('y2', 'numeric', (col) => col.notNull())
    .addColumn('length', 'numeric', (col) => col.notNull())
    .addColumn('drainageId', 'uuid', (col) =>
      col.references('drainages.id').onUpdate('cascade').onDelete('cascade')
    )
    .addColumn('basinId', 'uuid', (col) =>
      col.references('basins.id').onUpdate('cascade').onDelete('cascade')
    )
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updatedAt', 'timestamp')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('lines').execute();
}
