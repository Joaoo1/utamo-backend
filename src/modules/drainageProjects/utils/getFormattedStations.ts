import { StartEnd } from './calculate';

export const getFormattedStations = (startEnd: StartEnd, endsAt: number) => {
  const start = startEnd.start.int * 20 + startEnd.start.decimal;

  const end =
    startEnd.end.int === 'F'
      ? endsAt
      : startEnd.end.int * 20 + startEnd.end.decimal;

  return { start, end };
};
