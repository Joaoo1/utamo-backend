import { ColumnType } from 'kysely';

export interface Database {
  companies: CompanyTable;
  users: UsersTable;
  drainageProjects: DrainageProjectsTable;
  gutters: GuttersTable;
  drainages: DrainagesTable;
  basins: BasinsTable;
  lines: LinesTable;
  drainageSections: DrainageSectionsTable;
  calculations: CalculationsTable;
  calculationsBasins: CalculationsBasinsTable;
}

interface BaseTable {
  id: ColumnType<string, string, never>;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date | null, never, Date>;
}

interface CompanyTable extends BaseTable {
  name: string;
  active: boolean;
  image?: string;
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

export interface DrainagesTable extends BaseTable {
  name: string;
  length: number;
  drainageProjectId: ColumnType<string, string, never>;
}

export interface BasinsTable extends BaseTable {
  name: string;
  area: number;
  runoff: number;
  drainageProjectId: ColumnType<string, string, never>;
}

export interface DrainageSectionsTable extends BaseTable {
  slope: number;
  startsAt: number;
  endsAt: number;
  drainageId: ColumnType<string, string, never>;
}

export interface LinesTable extends BaseTable {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number;
  basinId: ColumnType<string | undefined>;
  drainageId: ColumnType<string | undefined>;
}

export interface CalculationsTable extends BaseTable {
  qMin: ColumnType<number, number | undefined, number>;
  qMax: ColumnType<number, number | undefined, number>;
  gap: ColumnType<number, number | undefined, number>;
  amMax: ColumnType<number, number | undefined, number>;
  amMin: ColumnType<number, number | undefined, number>;
  pmMax: ColumnType<number, number | undefined, number>;
  pmMin: ColumnType<number, number | undefined, number>;
  rhMax: ColumnType<number, number | undefined, number>;
  rhMin: ColumnType<number, number | undefined, number>;
  hnMax: ColumnType<number, number | undefined, number>;
  hnMin: ColumnType<number, number | undefined, number>;
  velocity: ColumnType<number, number | undefined, number>;
  projectFlow: ColumnType<number, number | undefined, number>;
  deviceLength: ColumnType<number, number | undefined, number>;
  minSlope: ColumnType<number, number | undefined, number>;
  maxSlope: ColumnType<number, number | undefined, number>;
  basinsTotalArea: number;
  runOff: number;
  startStationInt: number;
  startStationDecimal: number;
  endStationInt: ColumnType<'F' | number>;
  endStationDecimal: number;
  rainIntensity: number;
  concentrationTime: number;
  gutterId: string;
  drainageId: ColumnType<string, string, never>;
  drainageProjectId: ColumnType<string, string, never>;
}

export interface CalculationsBasinsTable {
  basinId: ColumnType<string, string, never>;
  calculationId: ColumnType<string, string, never>;
  createdAt: ColumnType<Date, string | undefined, never>;
}
