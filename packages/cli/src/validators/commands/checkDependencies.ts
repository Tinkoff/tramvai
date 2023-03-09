import any from '@tinkoff/utils/array/any';
import eachObj from '@tinkoff/utils/object/each';
import { sync as resolve } from 'resolve';
import { diff } from 'semver';
import chalk from 'chalk';
import type { Validator } from './validator.h';

const depsToCheck = [/^webpack$/, /^@babel/, /^postcss/];
const criticalDeps = [/^webpack$/, /^@babel\/core/, /^postcss$/];

export const checkDependencies: Validator = async ({ logger }) => {
  const rootDir = process.cwd();
  const packageJson = require('../../../package.json');
  let hasWrongDeps = false;
  let hasCriticalMismatch = false;

  eachObj((_, packageName: string) => {
    for (const check of depsToCheck) {
      if (check.test(packageName)) {
        const packagePath = `${packageName}/package.json`;
        const pathFromCli = resolve(packagePath);

        // некоторые зависимости не всплывают в node_modules проекта вообще, поэтому try-catch
        try {
          const pathFromRoot = resolve(packagePath, { basedir: rootDir });
          let versionDiff: ReturnType<typeof diff> = null;

          if (pathFromCli !== pathFromRoot) {
            hasWrongDeps = true;

            if (any((testRe) => testRe.test(packageName), criticalDeps)) {
              versionDiff = diff(require(pathFromRoot).version, require(pathFromCli).version);

              if (versionDiff === 'major') {
                hasCriticalMismatch = true;
              }
            }

            logger.event({
              type: versionDiff === 'major' ? 'error' : 'warning',
              event: 'COMMAND:VALIDATE:DEPENDENCIES',
              message: `Package ${chalk.underline(
                packageName
              )} has duplicates in @tramvai/cli (${pathFromCli}) and in the process.cwd (${pathFromRoot})`,
            });
          }
        } catch (err) {}
      }
    }
  }, packageJson.dependencies);

  if (hasWrongDeps) {
    return {
      name: 'checkDependencies',
      status: hasCriticalMismatch ? 'error' : 'warning',
      message: `
Found duplicates of some of the important dependencies for @tramvai/cli.
That can lead to unexpected problems due to how commonjs resolves imported modules.

To avoid possible problems it is preferably to do deduplication of the dependencies.
To do it refer the docs - https://tramvai.dev/docs/mistakes/duplicate-dependencies#using-package-manager
The exact list of important duplicates is above.
${
  hasCriticalMismatch
    ? ''
    : 'Please note that duplicates above not necessarily will cause problems, but if you have some cryptic issue with the build consider fixing duplicates first'
}
`,
    };
  }

  return {
    name: 'checkDependencies',
    status: 'ok',
  };
};
