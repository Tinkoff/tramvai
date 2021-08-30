import { createPapiMethod } from '@tramvai/papi';
import type { CLEAR_CACHE_TOKEN, LOGGER_TOKEN } from '@tramvai/tokens-common';

export const papiClearCache = ({
  clearCache,
  logger,
}: {
  clearCache: typeof CLEAR_CACHE_TOKEN;
  logger: typeof LOGGER_TOKEN;
}) => {
  const log = logger('cache:papi-clear-cache');

  return createPapiMethod({
    method: 'post',
    path: '/clear-cache',
    async handler({ res }) {
      await clearCache();

      // DEVOPS-1661
      res.status(404);
      res.header('X-Status', 'done');

      log.info('SERVER:CLEAR:CACHE:INTERNAL');
    },
  });
};
