import identity from '@tinkoff/utils/function/identity';
import flatten from '@tinkoff/utils/array/flatten';
import pick from '@tinkoff/utils/object/pick';
import type { REQUEST_MANAGER_TOKEN } from '@tramvai/module-common';
import type { API_CLIENT_PASS_HEADERS } from '@tramvai/tokens-http-client';
import type { HttpClientRequest } from '@tramvai/http-client';
import type { ExtractDependencyType } from '@tinkoff/dippy';

export const fillHeaderIp = ({
  requestManager,
}: {
  requestManager: ExtractDependencyType<typeof REQUEST_MANAGER_TOKEN> | null;
}) => {
  if (!requestManager) {
    return identity;
  }

  return (params: HttpClientRequest): HttpClientRequest => {
    return {
      ...params,
      headers: {
        ...params.headers,
        'X-real-ip': requestManager.getClientIp(),
      },
    };
  };
};

export const fillHeaders = ({
  requestManager,
  headersList,
}: {
  requestManager: ExtractDependencyType<typeof REQUEST_MANAGER_TOKEN> | null;
  headersList: ExtractDependencyType<typeof API_CLIENT_PASS_HEADERS> | null;
}) => {
  if (!requestManager) {
    return identity;
  }

  const headerNames = flatten<string>(headersList ?? []);

  return (params: HttpClientRequest): HttpClientRequest => {
    return {
      ...params,
      headers: {
        ...params.headers,
        ...pick(headerNames, requestManager.getHeaders()),
      },
    };
  };
};
