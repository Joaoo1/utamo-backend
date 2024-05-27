import { BaseEntity } from '../../../common/BaseEntity';

export interface Line extends BaseEntity {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number;
  drainageId?: string;
  basinId?: string;
}
