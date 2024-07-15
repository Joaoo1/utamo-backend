import { PlanFeature } from '../entities/PlanFeature';

export interface IAnalyzeStiStationsDto {
  minTolerance: number;
  maxTolerance: number;
  extraordinaryMinTolerance: number;
  extraordinaryMaxTolerance: number;
  maxLinesInExtraordinaryMinTolerance: number;
  planFeatures: PlanFeature[];
}
