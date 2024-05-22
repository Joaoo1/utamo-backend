import { BaseEntity } from '../../../common/BaseEntity';

export interface DrainageProject extends BaseEntity {
  name: string;
  defaultRainIntensity: number;
  defaultConcentrationTime: number;
  createdBy: string;
  companyId: string;
}
