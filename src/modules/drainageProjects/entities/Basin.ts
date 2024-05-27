import { BaseEntity } from '../../../common/BaseEntity';

export interface Basin extends BaseEntity {
  name: string;
  area: number;
  runoff: number;
  drainageProjectId: string;
}
