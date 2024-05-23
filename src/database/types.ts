import { ColumnType } from 'kysely';

export interface Database {
  companies: CompanyTable;
  users: UsersTable;
  drainageProjects: DrainageProjectsTable;
  gutters: GuttersTable;
}

interface BaseTable {
  id: ColumnType<string, string, never>;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date | null, never, Date>;
}

interface CompanyTable extends BaseTable {
  name: string;
  active: boolean;
}

export interface UsersTable extends BaseTable {
  name: string;
  email: string;
  passwordHash: string;
  companyId: string;
}

export interface DrainageProjectsTable extends BaseTable {
  name: string;
  defaultRainIntensity: number;
  defaultConcentrationTime: number;
  createdBy: ColumnType<string, string, never>;
  companyId: ColumnType<string, string, never>;
}

export enum GutterType {
  Triangular = 'triangular',
  Trapezoidal = 'trapezoidal',
  Rectangular = 'rectangular',
  Semicircular = 'semicircular',
}

export interface GuttersTable extends BaseTable {
  name: string;
  base: number;
  slope: number;
  maxHeight: number;
  roughness: number;
  maxSpeed: number;
  type: GutterType;
  drainageProjectId: ColumnType<string, string, never>;
}
