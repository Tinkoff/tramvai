import fs from 'fs';
import path from 'path';
import ora from 'ora';
import type { CLI_PACKAGE_MANAGER, CLI_ROOT_DIR_TOKEN } from '../di/tokens';

async function runtimeInstallPackage({
  packageManager,
  packageName,
  packageVersion,
  description = 'Устанавливаем зависимости',
  registry,
  noSave,
}: {
  packageManager: typeof CLI_PACKAGE_MANAGER;
  packageName: string;
  packageVersion?: string;
  description?: string;
  registry?: string;
  noSave?: boolean;
}) {
  if (await packageManager.exists({ name: packageName })) {
    return;
  }

  const spinner = ora({
    prefixText: description,
  }).start();

  try {
    await packageManager.install({
      name: packageName,
      version: packageVersion,
      registry,
      noSave,
    });
  } catch (e) {
    console.error(`Ошибка установки пакета ${packageName}: ${e}`);
  }

  spinner.stop();
}

/**
 * @deprecated Better do not use this function as it has some problems with npm@>=7
 * This function only used by @tramvai/cli mostly to install optional dependencies during usage and meant to install
 * single package in @tramvai/cli/node_modules dir. Before npm@7 it works just fine and there was only single package was installed.
 * But starting with npm@7 it now installs all of the dependencies tree (see [issue](https://github.com/npm/cli/issues/3023)) that leads
 * to very long installs and additional separate dependencies tree inside @tramvai/cli
 *
 * To mitigate this issue:
 * - wait to [rfc](https://github.com/npm/rfcs/pull/364) be implemented
 * - try [hack](https://github.com/npm/rfcs/pull/364#issuecomment-823637315) with internal workspace suggested in rfc from above
 * - use specific npm version by calling explicitly `npx -q npm@^6`
 */
async function npmRequire({
  cliRootDir,
  packageManager,
  packageName,
  description,
}: {
  cliRootDir: typeof CLI_ROOT_DIR_TOKEN;
  packageManager: typeof CLI_PACKAGE_MANAGER;
  packageName: string;
  description?: string;
}) {
  const cliPackageJsonFile = path.resolve(cliRootDir, 'package.json');
  // используем .npmrc приложения, т.к. .npmrc cli не публикуется
  const npmRcFile = path.resolve(process.cwd(), '.npmrc');
  let packageVersion;
  let registry;

  try {
    // @TODO считывать регистри из npmrc в di провайдере для CLI_PACKAGE_MANAGER
    // необходимо узнать registry для скачивания приватных пакетов
    const npmRc = await fs.promises.readFile(npmRcFile, 'utf8');

    const source = (npmRc || '')
      .trim()
      .split('\n')
      .reduce((result, line) => {
        if (!line.trim()) {
          return result;
        }

        const [key, value] = line.split('=');

        // eslint-disable-next-line no-param-reassign
        result[key.trim()] = value.trim();

        return result;
      }, {} as Record<string, any>);

    if (source.registry) {
      registry = source.registry;
    }
  } catch (e) {
    console.error(`Ошибка чтения .npmrc: ${e}`);
  }

  try {
    const { hiddenDependencies } = require(cliPackageJsonFile);

    if (packageName in hiddenDependencies) {
      packageVersion = hiddenDependencies[packageName];
    }
  } catch (e) {
    console.error(`Ошибка чтения package.json: ${e}`);
  }

  await runtimeInstallPackage({
    packageManager,
    packageName,
    packageVersion,
    description,
    registry,
    noSave: true,
  });

  return require(packageName);
}

/**
 * @deprecated Better do not use it, see deprecation notes for the npmRequire
 */
function npmRequireList({
  cliRootDir,
  packageManager,
  dependencies,
  description,
}: {
  cliRootDir: typeof CLI_ROOT_DIR_TOKEN;
  packageManager: typeof CLI_PACKAGE_MANAGER;
  dependencies: string[];
  description?: string;
}) {
  return Promise.all(
    dependencies.map((dependency) =>
      npmRequire({
        cliRootDir,
        packageManager,
        packageName: dependency,
        description,
      })
    )
  );
}

export { npmRequire, npmRequireList };
