import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  db.schema
    .createTable('companies')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('active', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updatedAt', 'timestamp')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('companies').execute();
}
