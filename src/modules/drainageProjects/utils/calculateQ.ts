import { Gutter } from '../entities/Gutter';
import { MinMax } from './calculate';

const calculatePmSMin = (hn: number, gutter: Gutter) => {
  // (n+2*hn*((1+m^2)^0,5))
  const a = Math.pow(1 + Math.pow(gutter.slope, 2), 0.5);
  return gutter.base + 2 * hn * a;
};

const calculateAmSMin = (hn: number, gutter: Gutter) => {
  // hn*(b+m*hn)
  return hn * (gutter.base + gutter.slope * hn);
};

export const calculateQ = (
  minOrMax: 'min' | 'max',
  minMaxSlope: MinMax,
  projectFlow: number,
  gutter: Gutter
) => {
  let hn = 0;
  const slope = minOrMax === 'min' ? minMaxSlope.min : minMaxSlope.max;

  while (hn <= gutter.maxHeight) {
    const am = calculateAmSMin(hn, gutter);
    const pm = calculatePmSMin(hn, gutter);
    const rh = pm === 0 ? 0 : am / pm;

    // (1/n)*(rh^(2/3))*am*(sMin^0.5)
    const q =
      (1 / gutter.roughness) *
      Math.pow(rh, 2 / 3) *
      am *
      Math.pow(slope / 100, 0.5);

    if (q >= projectFlow) {
      if (minOrMax === 'max') {
        return {
          velocity: q / am,
          qMax: q,
          amMax: am,
          pmMax: pm,
          rhMax: rh,
          hnMax: hn,
        };
      }

      return {
        gap: gutter.maxHeight - hn,
        qMin: q,
        amMin: am,
        pmMin: pm,
        rhMin: rh,
        hnMin: hn,
      };
    }

    const newHn = hn + 0.001;
    hn = parseFloat(newHn.toFixed(10));
  }

  return {};
};
