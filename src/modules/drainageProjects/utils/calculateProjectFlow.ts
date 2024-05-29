import { Basin } from '../entities/Basin';
import { calculateBasinsTotalArea } from './calculateBasinsTotalArea';

export const calculateProjectFlow = (
  runOff: number,
  rainIntensity: number,
  basins: Basin[]
) => {
  const basinsTotalArea = calculateBasinsTotalArea(basins);

  return (rainIntensity / 3600000) * runOff * basinsTotalArea;
};
