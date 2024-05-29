import { Basin } from '../entities/Basin';
import { calculateBasinsTotalArea } from './calculateBasinsTotalArea';

export const calculateRunoff = (basins: Basin[]) => {
  const a = basins.reduce((acc, b) => acc + b.area * b.runoff, 0);
  const b = calculateBasinsTotalArea(basins);

  return parseFloat((a / b).toFixed(2));
};
