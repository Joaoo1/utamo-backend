import { MinMax, Section } from './interfaces';

/**
 * Finds and returns the segments that contain the specified start or end point.
 * @param {number} start - The starting point.
 * @param {number} end - The ending point.
 * @returns {Array} - Array of segments containing the specified points.
 */
function findSelectedSections(
  sections: Section[],
  start: number,
  end: number
): Array<Section> {
  const selectedSections = sections.filter(
    (section) =>
      (start >= section.startsAt && start < section.endsAt) ||
      (end > section.startsAt && end <= section.endsAt) ||
      (start <= section.startsAt && end >= section.endsAt)
  );

  return selectedSections;
}

export const getMinMaxSlope = (
  sections: Section[],
  start: number,
  end: number | 'F'
): MinMax => {
  const formattedEnd = end === 'F' ? Infinity : end;

  const selectedSections = findSelectedSections(sections, start, formattedEnd);

  let min = Infinity;
  let max = 0;

  selectedSections.forEach((section) => {
    min = Math.min(min, section.slope);
    max = Math.max(max, section.slope);
  });

  return {
    min: parseFloat(min.toFixed(2)),
    max: parseFloat(max.toFixed(2)),
  };
};
