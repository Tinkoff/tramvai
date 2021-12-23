import type { REQUEST_MANAGER_TOKEN, RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';
import { throwRedirectFoundError, throwHttpError } from '@tinkoff/errors';
import type { Navigation, Router } from '@tinkoff/router';

type RouterOptions = Pick<
  ConstructorParameters<typeof Router>[0],
  'onRedirect' | 'onNotFound' | 'onBlock' | 'defaultRedirectCode'
>;

export const routerOptions = ({
  requestManager,
  responseManager,
}: {
  requestManager: typeof REQUEST_MANAGER_TOKEN;
  responseManager: typeof RESPONSE_MANAGER_TOKEN;
}): RouterOptions => {
  const throwError = (defaultStatus: number) => {
    return throwHttpError({
      httpStatus: responseManager.getStatus() >= 300 ? responseManager.getStatus() : defaultStatus,
    });
  };

  return {
    onNotFound: async () => {
      throwError(404);
    },
    onRedirect: async (navigation: Navigation) => {
      const { fromUrl, url, code } = navigation;

      throwRedirectFoundError({
        nextUrl: fromUrl.origin !== url.origin ? url.href : url.path,
        httpStatus: code,
      });
    },
    onBlock: async () => {
      throwError(500);
    },
    defaultRedirectCode: requestManager.getMethod() === 'GET' ? 301 : 308,
  };
};
