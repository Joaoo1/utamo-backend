import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType('GutterType')
    .asEnum(['triangular', 'trapezoidal', 'rectangular', 'semicircular'])
    .execute();

  await db.schema
    .createTable('gutters')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('base', 'numeric', (col) => col.notNull())
    .addColumn('slope', 'numeric', (col) => col.notNull())
    .addColumn('maxHeight', 'numeric', (col) => col.notNull())
    .addColumn('roughness', 'numeric', (col) => col.notNull())
    .addColumn('maxSpeed', 'numeric', (col) => col.notNull())
    .addColumn('type', sql`"GutterType"`, (col) => col.notNull())
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
  await db.schema.dropTable('gutters').execute();
  await db.schema.dropType('GutterType').execute();
}
