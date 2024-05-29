export interface IUpdateCalculationDTO {
  id: string;
  drainageProjectId: string;
  userCompanyId: string;
  basinsIds: string[];
  gutterId: string;
  startStationInt: number;
  startStationDecimal: number;
  endStationInt: number | 'F';
  endStationDecimal: number;
  rainIntensity: number;
  concentrationTime: number;
}
