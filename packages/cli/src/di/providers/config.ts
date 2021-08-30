import path from 'path';
import type { Provider } from '@tinkoff/dippy';
import {
  COMMAND_PARAMETERS_TOKEN,
  CONFIG_ROOT_DIR_TOKEN,
  CONFIG_ENTRY_TOKEN,
  CLI_ROOT_DIR_TOKEN,
} from '../tokens';
import { getTramvaiConfig } from '../../utils/getTramvaiConfig';
import { ConfigManager } from '../../models/config';
import { syncJsonFile } from '../../utils/syncJsonFile';

export const configProviders: readonly Provider[] = [
  {
    provide: CLI_ROOT_DIR_TOKEN,
    useFactory: () => {
      return path.resolve(__dirname, '../', '../', '../');
    },
  },
  {
    provide: CONFIG_ROOT_DIR_TOKEN,
    useFactory: ({ params }) => {
      return params.rootDir ?? process.cwd();
    },
    deps: {
      params: COMMAND_PARAMETERS_TOKEN,
    },
  },
  {
    provide: CONFIG_ENTRY_TOKEN,
    useFactory: ({
      params,
      rootDir,
    }: {
      params: typeof COMMAND_PARAMETERS_TOKEN;
      rootDir: typeof CONFIG_ROOT_DIR_TOKEN;
    }) => {
      if ('config' in params) {
        const { config } = params;

        const manager = new ConfigManager({
          config: { projects: { [config.name]: config } },
          syncConfigFile: syncJsonFile,
        });

        return manager.getProject(config.name);
      }

      const { target } = params;

      if (!target) {
        throw new Error(
          'Config should be passed as parameter or target from tramvai.json should be defined'
        );
      }

      const { content, isSuccessful } = getTramvaiConfig(rootDir);

      if (!isSuccessful) {
        throw new Error('Config neither passed as parameter or found in file system');
      }

      const manager = new ConfigManager({ config: content, syncConfigFile: syncJsonFile });

      return manager.getProject(target);
    },
    deps: {
      params: COMMAND_PARAMETERS_TOKEN,
      rootDir: CONFIG_ROOT_DIR_TOKEN,
    },
  },
] as const;
