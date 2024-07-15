export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  z1: number;
  z2: number;
  length: number;
}

export interface PlanFeature {
  name: string;
  lines: Line[];
}
