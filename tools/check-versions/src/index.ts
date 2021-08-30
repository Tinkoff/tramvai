import { logger } from '@tinkoff/logger';
import { getTramvaiDepsVersions } from './getTramvaiDepsVersions';
import { checkVersions } from './checkVersions';

const log = logger('tramvai-check-versions');

logger.enable('info', 'tramvai-check-versions');

export const run = async () => {
  log.info('Проверка версий tramvai модулей в приложении');

  const depsVersions = await getTramvaiDepsVersions();

  checkVersions(depsVersions);
};
