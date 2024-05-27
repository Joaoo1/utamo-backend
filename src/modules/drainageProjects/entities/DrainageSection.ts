import { BaseEntity } from '../../../common/BaseEntity';

export interface DrainageSection extends BaseEntity {
  slope: number;
  startsAt: number;
  endsAt: number;
  drainageId: string;
}
