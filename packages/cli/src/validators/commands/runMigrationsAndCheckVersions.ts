import { command } from 'execa';
import { isLockfileChanged } from '../../utils/lockfileHash';
import type { Validator } from './validator.h';

export const runMigrationsAndCheckVersions: Validator = async (context) => {
  if (isLockfileChanged(context)) {
    await command(`npx tramvai-migrate`, { stdio: 'inherit' });
    await command(`npx tramvai-check-versions`, { stdio: 'inherit' });
  }

  return { name: 'runMigrationsAndCheckVersions', status: 'ok' };
};
