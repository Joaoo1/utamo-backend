import { parse } from 'node:url';

export const getQueryParamFromUrl = (url: string, paramName: string) => {
  const param = parse(url, true).query?.[paramName];
  return Array.isArray(param) ? param[0] : param;
};

export const getFormattedDataToSend = (event: string, data: any) =>
  JSON.stringify([event, data]);
