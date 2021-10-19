import type { Provider } from '@tinkoff/dippy';
import { NpmPackageManager, resolvePackageManager } from '@tinkoff/package-manager-wrapper';
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
      return resolvePackageManager({ rootDir }, { throwUnknown: true });
    },
    deps: {
      rootDir: CONFIG_ROOT_DIR_TOKEN,
    },
  },
] as const;
