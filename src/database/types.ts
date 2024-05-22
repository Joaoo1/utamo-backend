import { ColumnType } from 'kysely';

export interface Database {
  companies: CompanyTable;
  users: UsersTable;
}

export interface CompanyTable {
  id: string;
  name: string;
  active: boolean;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string, Date>;
}

export interface UsersTable {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  companyId: string;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string, Date>;
}
