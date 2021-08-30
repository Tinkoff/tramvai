import eachObj from '@tinkoff/utils/object/each';
import { sync as resolve } from 'resolve';

import type { Context } from '../../models/context';

const depsToCheck = [/^webpack$/, /^@babel/, /^postcss/];

export const checkDependencies = async ({ logger }: Context) => {
  const rootDir = process.cwd();
  const packageJson = require('../../../package.json');
  let hasWrongDeps = false;

  eachObj((_, packageName: string) => {
    for (const check of depsToCheck) {
      if (check.test(packageName)) {
        const packagePath = `${packageName}/package.json`;
        const pathFromCli = resolve(packagePath);

        // некоторые зависимости не всплывают в node_modules проекта вообще, поэтому try-catch
        try {
          const pathFromRoot = resolve(packagePath, { basedir: rootDir });

          if (pathFromCli !== pathFromRoot) {
            logger.event({
              type: 'warning',
              event: 'COMMAND:VALIDATE:DEPENDENCIES',
              message: `Package ${packageName} has duplicates in @tramvai/cli (${pathFromCli}) and in the process.cwd (${pathFromRoot})`,
            });

            hasWrongDeps = true;
          }
        } catch (err) {}
      }
    }
  }, packageJson.dependencies);

  if (hasWrongDeps) {
    return {
      name: 'checkDependencies',
      status: 'warning',
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
