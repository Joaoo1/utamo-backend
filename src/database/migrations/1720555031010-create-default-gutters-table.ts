import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('defaultGutters')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('color', 'varchar(255)', (col) => col.notNull())
    .addColumn('base', 'numeric', (col) => col.notNull())
    .addColumn('slope', 'numeric', (col) => col.notNull())
    .addColumn('maxHeight', 'numeric', (col) => col.notNull())
    .addColumn('roughness', 'numeric', (col) => col.notNull())
    .addColumn('maxSpeed', 'numeric', (col) => col.notNull())
    .addColumn('type', sql`"GutterType"`, (col) => col.notNull())
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
  await db.schema.dropTable('default_gutters').execute();
}
