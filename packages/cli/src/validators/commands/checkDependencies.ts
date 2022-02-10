import any from '@tinkoff/utils/array/any';
import eachObj from '@tinkoff/utils/object/each';
import { sync as resolve } from 'resolve';
import { diff } from 'semver';
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
              message: `Package ${packageName} has duplicates in @tramvai/cli (${pathFromCli}) and in the process.cwd (${pathFromRoot})`,
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
Некоторые важные пакеты необходимые для работы @tramvai/cli дублируются,
что может привести к неочевидным багам и проблемам из-за особенностей commonjs по поиску импортируемых модулей.

Во избежании возможных проблем желательно провести дедупликацию таких пакетов.
Сам список проблемных пакетов выведен выше.
Для дедупликации можно предпринять следующие шаги (после каждого шага можно перезапустить сборку для проверки):
    1. Вызвать команды дедупликации своего пакетного менеджера: npm dedupe; yarn-deduplicate
    2. Пересобрать lock файл полностью (удалить node_modules, удалить package-lock.json или yarn.lock и запустить установку пакетов)
    3. Если ничего из выше не помогло, то проверить какие пакеты тянут в сборку проблемные пакеты и постараться реорганизовать работу с ними (npm ls; yarn why)
    4. Возможно дубликаты ничего не ломают и их можно не трогать, если проблемы всё же есть и их не получается решить обратитесь в чат #tramvai с описанием проблемы
            `,
    };
  }

  return {
    name: 'checkDependencies',
    status: 'ok',
  };
};
