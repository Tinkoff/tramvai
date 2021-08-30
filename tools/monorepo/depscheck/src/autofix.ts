import type { Results } from 'depcheck';
import cloneDeep from '@tinkoff/utils/clone';
import fs from 'fs';
import { detectIndent } from './utils';
import { logger } from './logger';
import type { Package } from './types';

const removeUnused = (
  pkgDeps: Package['meta']['dependencies'] = {},
  resDeps: Results['dependencies']
) => {
  Object.keys(pkgDeps).forEach((dep) => {
    const resIndex = resDeps.indexOf(dep as string);

    if (resIndex !== -1) {
      logger.info(`dependency "${dep}" is removed`);
      resDeps.splice(resIndex, 1);
      // eslint-disable-next-line no-param-reassign
      delete pkgDeps[dep];
    }
  });
};

export function autofix(pkg: Package, res: Results) {
  if (!res.dependencies.length && !res.devDependencies.length) {
    return;
  }

  logger.start('fixing', pkg.name);

  const pkgMetaCopy = cloneDeep(pkg.meta);
  const indent = detectIndent(fs.readFileSync(pkg.manifestPath, 'utf-8'));

  removeUnused(pkgMetaCopy.dependencies, res.dependencies);
  removeUnused(pkgMetaCopy.devDependencies, res.devDependencies);

  fs.writeFileSync(pkg.manifestPath, JSON.stringify(pkgMetaCopy, null, indent), 'utf-8');
}
