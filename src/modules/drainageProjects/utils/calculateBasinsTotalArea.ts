import { Basin } from '../entities/Basin';

export const calculateBasinsTotalArea = (basins: Basin[]) => {
  return basins.reduce((acc, b) => acc + b.area, 0);
};
