import type { Results } from 'depcheck';
import depcheck from 'depcheck';

import isEmpty from '@tinkoff/utils/is/empty';

import minimatch from 'minimatch';

import type { Checker, CheckResults, Config } from './types';
import { logger } from './logger';
import { getCollectorConfig, getDepcheckConfig } from './config';
import { checkMonorepoVersionsMatch } from './checks/checkVersionsMatch';
import { autofix } from './autofix';
import { checkPeerDependencies } from './checks/checkPeerDependencies';
import { prettyPrint } from './utils';

const CHECKERS: Checker[] = [checkMonorepoVersionsMatch, checkPeerDependencies];

function hasIssues(result: CheckResults) {
  return !(
    isEmpty(result.dependencies) &&
    isEmpty(result.devDependencies) &&
    isEmpty(result.missing) &&
    isEmpty(result.mismatched)
  );
}

function applyIgnoreMissing(result: Results, ignorePatterns: string[] = []) {
  if (result.missing && ignorePatterns.length) {
    Object.keys(result.missing).forEach((k) => {
      // eslint-disable-next-line no-param-reassign
      result.missing[k] = result.missing[k].filter(
        (filePath) => !ignorePatterns.some((p) => minimatch(filePath, p))
      );
      if (result.missing[k].length === 0) {
        // eslint-disable-next-line no-param-reassign
        delete result.missing[k];
      }
    });
  }
}

function applyIgnoreUnused(result: Results, ignorePatterns: string[] = []) {
  if ((result.dependencies || result.devDependencies) && ignorePatterns.length) {
    const [deps, devDeps] = [result.dependencies, result.devDependencies].map((modules) =>
      modules.filter((moduleName) => {
        return !ignorePatterns.some((p) => minimatch(moduleName, p));
      })
    );
    // eslint-disable-next-line no-param-reassign
    result.dependencies = deps;
    // eslint-disable-next-line no-param-reassign
    result.devDependencies = devDeps;
  }
}

export async function depscheck(config: Config) {
  const depcheckConfig = getDepcheckConfig(config);
  const { allPkgs, affectedPkgs } = await config.collector(getCollectorConfig(config));
  const failuresResults = [];

  for (const pkg of affectedPkgs) {
    if (pkg.path === '.') {
      // ignoring root
      continue;
    }

    logger.start('Processing', pkg.name);

    const res = (await depcheck(pkg.absPath, depcheckConfig)) as CheckResults;
    applyIgnoreMissing(res, config.ignorePatterns);
    applyIgnoreUnused(res, config.ignoreUnused);
    CHECKERS.forEach((checker) => checker(allPkgs, pkg, res, config));

    if (config.fix) {
      autofix(pkg, res);
    }

    if (hasIssues(res)) {
      failuresResults.push({ res, pkg });
      logger.error('Failed check', pkg.name, '(details at log end)');
    }
  }

  if (failuresResults.length) {
    failuresResults.forEach(({ res, pkg }) => prettyPrint(res, pkg.absPath, process.cwd()));
  }

  return !failuresResults.length;
}
