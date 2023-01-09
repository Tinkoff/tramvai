import type { HttpClientRequest } from '@tramvai/http-client';

export const fillHeaders = (deps: any) => (params: HttpClientRequest) => {
  return params;
};

export const fillHeaderIp = fillHeaders;
