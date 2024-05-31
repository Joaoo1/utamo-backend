import { CalculationBasin } from './interfaces';
import { calculateBasinsTotalArea } from './calculateBasinsTotalArea';

export const calculateProjectFlow = (
  runOff: number,
  rainIntensity: number,
  basins: CalculationBasin[]
) => {
  const basinsTotalArea = calculateBasinsTotalArea(basins);

  return (rainIntensity / 3600000) * runOff * basinsTotalArea;
};
