import { StartEnd } from './calculate';

export const calculateDeviceLength = (startEnd: StartEnd, endsAt: number) => {
  const formattedEnd =
    startEnd.end.int === 'F' ? endsAt : startEnd.end.int * 20;

  const result =
    formattedEnd -
    startEnd.start.int * 20 +
    startEnd.end.decimal -
    startEnd.start.decimal;

  return parseInt(result.toFixed(0));
};
