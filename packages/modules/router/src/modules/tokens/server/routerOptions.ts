import type { REQUEST_MANAGER_TOKEN, RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';
import { HttpError, makeErrorSilent, RedirectFoundError } from '@tinkoff/errors';
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
  const getUrl = (navigation: Navigation) => navigation.url?.path ?? requestManager.getUrl();

  const throwError = ({ defaultStatus, url }: { defaultStatus: number; url: string }) => {
    const error = new HttpError({
      url,
      httpStatus: responseManager.getStatus() >= 300 ? responseManager.getStatus() : defaultStatus,
    });

    makeErrorSilent(error);

    throw error;
  };

  return {
    onNotFound: async (navigation: Navigation) => {
      // isSilent is used to prevent command line error logs,
      // because 404 errors is expected behavior
      throwError({ defaultStatus: 404, url: getUrl(navigation) });
    },
    onRedirect: async (navigation: Navigation) => {
      const { fromUrl, url, code } = navigation;

      const error = new RedirectFoundError({
        url: getUrl(navigation),
        nextUrl: fromUrl.origin !== url.origin ? url.href : url.path,
        httpStatus: code,
        silent: true,
      });

      makeErrorSilent(error);

      throw error;
    },
    onBlock: async (navigation: Navigation) => {
      throwError({ defaultStatus: 500, url: getUrl(navigation) });
    },
    defaultRedirectCode: requestManager.getMethod() === 'GET' ? 301 : 308,
  };
};
