import { CalculationBasin } from './interfaces';
import { calculateBasinsTotalArea } from './calculateBasinsTotalArea';

export const calculateRunoff = (basins: CalculationBasin[]) => {
  const a = basins.reduce((acc, b) => acc + b.area * b.runoff, 0);
  const b = calculateBasinsTotalArea(basins);

  return parseFloat((a / b).toFixed(2));
};
