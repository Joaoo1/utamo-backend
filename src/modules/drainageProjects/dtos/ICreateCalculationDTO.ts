export interface ICreateCalculationDTO {
  basinsIds: string[];
  gutterId: string;
  drainageId: string;
  drainageProjectId: string;
  startStationInt: number;
  startStationDecimal: number;
  endStationInt: number | 'F';
  endStationDecimal: number;
  rainIntensity: number;
  concentrationTime: number;
  userCompanyId: string;
  shouldSave: boolean;
}
