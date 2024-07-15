import { IAnalyzeStiStationsDto } from '../dtos/IAnalyzeStiStationsDto';
import { Line } from '../entities/PlanFeature';

export class AnalyzeStiStationsUseCase {
  constructor() {}

  async execute({
    minTolerance,
    maxTolerance,
    extraordinaryMinTolerance,
    extraordinaryMaxTolerance,
    maxLinesInExtraordinaryMinTolerance,
    planFeatures,
  }: IAnalyzeStiStationsDto) {
    const analyzedPlanFeatures = planFeatures.map(({ lines, name }) => {
      const totalLength = lines.reduce((a, l) => a + l.length, 0);
      const startEndSlope = this.roundNumber(
        (lines[0].z1 - lines.at(-1)!.z2) / totalLength,
        4
      );
      const trackerLines: Line[] = [];

      lines.forEach((line, index) => {
        if (index === 0) {
          trackerLines.push({
            z1: line.z1,
            z2: line.z1 - line.length * startEndSlope,
          } as Line);
          return;
        }

        trackerLines.push({
          z1: trackerLines.at(-1)!.z2,
          z2: trackerLines.at(-1)!.z2 - line.length * startEndSlope,
        } as Line);
      });

      const diffs = trackerLines.map((trackerLine, index) =>
        this.roundNumber(trackerLine.z2 - lines[index].z2, 3)
      );

      diffs.unshift(trackerLines[0].z1 - lines[0].z1);

      const isPlanFeatureInTolerance = diffs.every(
        (diff) => diff >= minTolerance && diff <= maxTolerance
      );

      if (isPlanFeatureInTolerance) {
        return {
          lines,
          trackerLines,
          name,
          adjustment: 0,
          oldDiffs: diffs,
          newDiffs: diffs,
          maxTolerance,
          minTolerance,
        };
      }

      const highestDiff = Math.max(...diffs);
      const highAdjustment =
        highestDiff > maxTolerance
          ? this.roundNumber(highestDiff - maxTolerance, 3)
          : 0;

      let adjustedDiffs = diffs.map((diff) =>
        this.roundNumber(diff - highAdjustment, 3)
      );

      const lowestDiff = Math.min(...adjustedDiffs);
      const lowAdjustment =
        lowestDiff < minTolerance
          ? this.roundNumber(minTolerance - lowestDiff, 3)
          : 0;
      adjustedDiffs = adjustedDiffs.map((diff) =>
        this.roundNumber(lowAdjustment + diff, 3)
      );

      const firstDiffThatCantGoExtraordinaryMin = [...adjustedDiffs].sort(
        (a, b) => a - b
      )[maxLinesInExtraordinaryMinTolerance];
      const allowed = Math.abs(
        minTolerance - firstDiffThatCantGoExtraordinaryMin
      );
      const allowed1 = Math.abs(
        extraordinaryMinTolerance - Math.min(...adjustedDiffs)
      );
      const limitToGoDown = Math.min(allowed, allowed1);

      adjustedDiffs = adjustedDiffs.map((d) =>
        this.roundNumber(d - limitToGoDown, 3)
      );

      const diffsAboveExtraordinaryMax = adjustedDiffs.filter(
        (d) => d > extraordinaryMaxTolerance
      );

      if (diffsAboveExtraordinaryMax.length > 0) {
        return {
          lines,
          trackerLines,
          name,
          adjustment: null,
          oldDiffs: diffs,
          newDiffs: diffs,
          maxTolerance,
          minTolerance,
        };
      }

      const highestDiff1 = [...adjustedDiffs].sort((a, b) => a - b).at(-1)!;
      const canGoUp = highestDiff1 < maxTolerance;

      let adjustment = 0;
      if (canGoUp) {
        adjustment = this.roundNumber(maxTolerance - highestDiff1, 3);
        adjustedDiffs = adjustedDiffs.map((d) =>
          this.roundNumber(d + adjustment, 3)
        );
      }

      const [lowestDiff2, ...rest] = [...adjustedDiffs].sort((a, b) => a - b);
      const canAdjust =
        lowestDiff2 > minTolerance && rest.at(-1)! < maxTolerance;

      let adjustment1 = 0;
      if (canAdjust) {
        adjustment1 = this.roundNumber(
          (Math.abs(lowestDiff + minTolerance) -
            Math.abs(maxTolerance - highestDiff)) /
            2,
          3
        );
        adjustedDiffs = adjustedDiffs.map((d) =>
          this.roundNumber(d + adjustment, 3)
        );
      }

      return {
        lines,
        trackerLines,
        name,
        adjustment: this.roundNumber(
          adjustment +
            adjustment1 +
            lowAdjustment -
            highAdjustment -
            limitToGoDown,
          3
        ),
        oldDiffs: diffs,
        newDiffs: adjustedDiffs,
        maxTolerance,
        minTolerance,
      };
    });

    return analyzedPlanFeatures;
  }

  private roundNumber(number: number, fractionDigits: number) {
    return parseFloat(number.toFixed(fractionDigits));
  }
}
