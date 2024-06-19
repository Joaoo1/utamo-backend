import { BaseEntity } from '../../../common/BaseEntity';

export interface Calculation extends BaseEntity {
  qMin: number;
  qMax: number;
  gap: number;
  amMax: number;
  amMin: number;
  pmMax: number;
  pmMin: number;
  rhMax: number;
  rhMin: number;
  hnMax: number;
  hnMin: number;
  velocity: number;
  projectFlow: number;
  deviceLength: number;
  minSlope: number;
  maxSlope: number;
  basinsTotalArea: number;
  runOff: number;
  startStationInt: number;
  startStationDecimal: number;
  endStationInt: string;
  endStationDecimal: number;
  rainIntensity: number;
  concentrationTime: number;
  gutterId: string;
  drainageProjectId: string;
  drainageId: string;
}
