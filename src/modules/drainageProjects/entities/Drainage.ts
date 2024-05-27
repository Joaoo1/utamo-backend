import { BaseEntity } from '../../../common/BaseEntity';

export interface Drainage extends BaseEntity {
  name: string;
  length: number;
  drainageProjectId: string;
}
