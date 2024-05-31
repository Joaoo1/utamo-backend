import { CalculationBasin } from './interfaces';

export const calculateBasinsTotalArea = (basins: CalculationBasin[]) => {
  return basins.reduce((acc, b) => acc + b.area, 0);
};
