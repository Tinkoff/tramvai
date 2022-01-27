import { resolve } from 'path';
import type { Container } from '@tinkoff/dippy';
import { TramvaiBuild } from '@tramvai/build';
import type { PackageConfigEntry } from '../../typings/configEntry/package';
import type { Params, Result } from './index';
import {
  COMMAND_PARAMETERS_TOKEN,
  CONFIG_ENTRY_TOKEN,
  CONFIG_ROOT_DIR_TOKEN,
} from '../../di/tokens';

export const buildPackage = async (di: Container): Result => {
  const parameters = di.get(COMMAND_PARAMETERS_TOKEN as Params);
  const configEntry = di.get(CONFIG_ENTRY_TOKEN as PackageConfigEntry);
  const configRootDir = di.get(CONFIG_ROOT_DIR_TOKEN);
  const rootDir = resolve(configRootDir, configEntry.root);

  process.chdir(rootDir);

  await new TramvaiBuild({
    watchMode: !!parameters.watchMode,
    forPublish: !!parameters.forPublish,
  }).start();

  return {
    getBuildStats() {
      return {};
    },
  };
};
