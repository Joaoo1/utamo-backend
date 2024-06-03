import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('drainageSections')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('slope', 'numeric', (col) => col.notNull())
    .addColumn('startsAt', 'numeric', (col) => col.notNull())
    .addColumn('endsAt', 'numeric', (col) => col.notNull())
    .addColumn('drainageId', 'uuid', (col) =>
      col
        .references('drainages.id')
        .notNull()
        .onUpdate('cascade')
        .onDelete('cascade')
    )
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updatedAt', 'timestamp')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('drainageSections').execute();
}
