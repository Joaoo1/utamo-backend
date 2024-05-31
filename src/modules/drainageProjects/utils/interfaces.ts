export interface StartEnd {
  start: {
    int: number;
    decimal: number;
  };
  end: {
    int: number | 'F';
    decimal: number;
  };
}

export interface MinMax {
  min: number;
  max: number;
}

export interface Section {
  startsAt: number;
  endsAt: number;
  slope: number;
}

export interface CalculationGutter {
  maxHeight: number;
  roughness: number;
  base: number;
  slope: number;
}

export interface CalculationBasin {
  area: number;
  runoff: number;
}
