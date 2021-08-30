import { resolve } from 'path';
import type { Container } from '@tinkoff/dippy';
import { npmRequire } from '../../utils/npmRequire';
import type { PackageConfigEntry } from '../../typings/configEntry/package';
import type { Params, Result } from './index';
import {
  COMMAND_PARAMETERS_TOKEN,
  CLI_ROOT_DIR_TOKEN,
  CLI_PACKAGE_MANAGER,
  CONFIG_ENTRY_TOKEN,
  CONFIG_ROOT_DIR_TOKEN,
} from '../../di/tokens';

export const buildPackage = async (di: Container): Result => {
  const parameters = di.get(COMMAND_PARAMETERS_TOKEN as Params);
  const cliRootDir = di.get(CLI_ROOT_DIR_TOKEN);
  let rootDir = di.get(CONFIG_ROOT_DIR_TOKEN);
  const packageManager = di.get(CLI_PACKAGE_MANAGER);
  const configEntry = di.get(CONFIG_ENTRY_TOKEN as PackageConfigEntry);

  const { run } = await npmRequire({
    cliRootDir,
    packageManager,
    packageName: '@tramvai/build',
    description: 'Устанавливаем зависимости для сборки package',
  });

  if (configEntry.root) {
    try {
      rootDir = resolve(rootDir, configEntry.root);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  process.chdir(rootDir);

  const options: any = {
    cwd: rootDir,
    loggerName: 'cli:build:package',
    watch: !!parameters.watch,
    optionsFromPackageJson: true,
    changeTypings: false,
  };

  await run(options);

  return {
    getStats() {
      return {};
    },
  };
};
