import { calculateBasinsTotalArea } from './calculateBasinsTotalArea';
import { calculateDeviceLength } from './calculateDeviceLength';
import { calculateProjectFlow } from './calculateProjectFlow';
import { calculateQ } from './calculateQ';
import { calculateRunoff } from './calculateRunOff';
import { getFormattedStations } from './getFormattedStations';
import { getMinMaxSlope } from './getMinMaxSlope';
import {
  CalculationBasin,
  CalculationGutter,
  Section,
  StartEnd,
} from './interfaces';

interface CalculationData {
  gutter: CalculationGutter;
  basins: CalculationBasin[];
  startEnd: StartEnd;
  concentrationTime: number;
  rainIntensity: number;
  drainageSections: Section[];
}

export const calculate = (calculationData: CalculationData) => {
  const sections = [...calculationData.drainageSections].sort(
    (a, b) => a.startsAt - b.startsAt
  );
  const endsAt = sections.at(-1)!.endsAt;

  const { start, end } = getFormattedStations(calculationData.startEnd, endsAt);

  const minMaxSlope = getMinMaxSlope(sections, start, end);

  const runOff = calculateRunoff(calculationData.basins);
  const projectFlow = calculateProjectFlow(
    runOff,
    calculationData.rainIntensity,
    calculationData.basins
  );
  const deviceLength = calculateDeviceLength(calculationData.startEnd, endsAt);
  const {
    qMin = 0,
    gap = 0,
    amMin = 0,
    pmMin = 0,
    hnMin = 0,
    rhMin = 0,
  } = calculateQ('min', minMaxSlope, projectFlow, calculationData.gutter);
  const {
    qMax = 0,
    velocity = 0,
    amMax = 0,
    pmMax = 0,
    hnMax = 0,
    rhMax = 0,
  } = calculateQ('max', minMaxSlope, projectFlow, calculationData.gutter);
  const basinsTotalArea = calculateBasinsTotalArea(calculationData.basins);

  return {
    qMin,
    qMax,
    gap,
    amMax,
    amMin,
    pmMax,
    pmMin,
    rhMax,
    rhMin,
    hnMax,
    hnMin,
    velocity,
    projectFlow,
    deviceLength,
    minSlope: minMaxSlope.min,
    maxSlope: minMaxSlope.max,
    basinsTotalArea,
    runOff,
  };
};
