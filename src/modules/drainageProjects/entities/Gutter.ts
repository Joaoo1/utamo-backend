import { BaseEntity } from '../../../common/BaseEntity';

enum GutterType {
  Triangular = 'triangular',
  Trapezoidal = 'trapezoidal',
  Retangular = 'retangular',
  Semicircular = 'semicircular',
}

export interface Gutter extends BaseEntity {
  name: string;
  base: number;
  slope: number;
  maxHeight: number;
  roughness: number;
  maxSpeed: number;
  type: GutterType;
  drainageProjectId: string;
}
