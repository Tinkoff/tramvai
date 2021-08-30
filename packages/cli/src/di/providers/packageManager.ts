import fs from 'fs';
import type { Provider } from '@tinkoff/dippy';
import type { PackageManagerOptions } from '../../services/packageManager';
import { NpmPackageManager, YarnPackageManager } from '../../services/packageManager';
import {
  CLI_PACKAGE_MANAGER,
  APPLICATION_PACKAGE_MANAGER,
  CONFIG_ROOT_DIR_TOKEN,
  CLI_ROOT_DIR_TOKEN,
} from '../tokens';

export const packageManagerProviders: readonly Provider[] = [
  {
    provide: CLI_PACKAGE_MANAGER,
    useFactory: ({ rootDir }) => {
      return new NpmPackageManager({ rootDir });
    },
    deps: {
      rootDir: CLI_ROOT_DIR_TOKEN,
    },
  },
  {
    provide: APPLICATION_PACKAGE_MANAGER,
    useFactory: ({ rootDir }) => {
      const options: PackageManagerOptions = {
        rootDir,
      };

      if (fs.existsSync('./yarn.lock')) {
        return new YarnPackageManager(options);
      }
      if (fs.existsSync('./package-lock.json')) {
        return new NpmPackageManager(options);
      }

      throw new Error(
        'Используемый на проекте менеджер пакетов не поддерживается, либо lock-файл не найден'
      );
    },
    deps: {
      rootDir: CONFIG_ROOT_DIR_TOKEN,
    },
  },
] as const;
