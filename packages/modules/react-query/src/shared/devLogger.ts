import type { ExtractDependencyType } from '@tinkoff/dippy';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';

export const devLoggerFactory = (logger: ExtractDependencyType<typeof LOGGER_TOKEN>) => {
  const log = logger('react-query');

  return {
    log: log.info,
    warn: log.warn,
    error: log.error,
  };
};
