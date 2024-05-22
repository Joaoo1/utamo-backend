import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  db.schema
    .createTable('users')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('email', 'varchar(255)', (col) => col.notNull())
    .addColumn('passwordHash', 'varchar(255)', (col) => col.notNull())
    .addColumn('companyId', 'uuid', (col) =>
      col.references('companies.id').notNull()
    )
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updatedAt', 'timestamp')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute();
}
