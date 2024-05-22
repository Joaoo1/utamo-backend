import { ColumnType } from 'kysely';

export interface Database {
  companies: CompanyTable;
  users: UsersTable;
  drainageProjects: DrainageProjectsTable;
}

interface BaseTable {
  id: string;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date | null, never, Date>;
}

interface CompanyTable extends BaseTable {
  name: string;
  active: boolean;
}

interface UsersTable extends BaseTable {
  name: string;
  email: string;
  passwordHash: string;
  companyId: string;
}

interface DrainageProjectsTable extends BaseTable {
  name: string;
  defaultRainIntensity: number;
  defaultConcentrationTime: number;
  createdBy: string;
  companyId: string;
}
