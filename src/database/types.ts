import { ColumnType } from 'kysely';

export interface Database {
  companies: CompanyTable;
}

export interface CompanyTable {
  id: string;
  name: string;
  active: boolean;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string, Date>;
}
