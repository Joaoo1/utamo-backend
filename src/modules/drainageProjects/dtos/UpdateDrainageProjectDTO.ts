export interface UpdateDrainageProjectDTO {
  name?: string;
  defaultRainIntensity?: number;
  defaultConcentrationTime?: number;
  userCompanyId: string;
  id: string;
}
