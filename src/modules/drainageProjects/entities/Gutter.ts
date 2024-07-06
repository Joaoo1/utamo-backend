import { BaseEntity } from '../../../common/BaseEntity';

enum GutterType {
  Triangular = 'triangular',
  Trapezoidal = 'trapezoidal',
  Rectangular = 'rectangular',
  Semicircular = 'semicircular',
}

export interface Gutter extends BaseEntity {
  name: string;
  color: string;
  base: number;
  slope: number;
  maxHeight: number;
  roughness: number;
  maxSpeed: number;
  type: GutterType;
  drainageProjectId: string;
}
