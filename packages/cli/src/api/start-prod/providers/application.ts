import path from 'path';
import type { Provider } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';
import { fork } from 'child_process';
import {
  COMMAND_PARAMETERS_TOKEN,
  CONFIG_ENTRY_TOKEN,
  CONFIG_MANAGER_TOKEN,
} from '../../../di/tokens';
import type { Params } from '../index';
import type { ConfigEntry } from '../../../typings/configEntry/common';
import { CLOSE_HANDLER_TOKEN, SERVER_PROCESS_TOKEN } from '../tokens';
import { DEBUG_ARGV } from '../../../config/constants';
import { detectPortSync } from '../../../utils/detectPortSync';
import { safeRequire } from '../../../utils/safeRequire';
import type { ConfigManager } from '../../../config/configManager';
import {
  createConfigManager,
  DEFAULT_PORT,
  DEFAULT_STATIC_PORT,
} from '../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../typings/configEntry/application';

export const applicationsProviders: readonly Provider[] = [
  provide({
    provide: CONFIG_MANAGER_TOKEN,
    useFactory: ({ configEntry, parameters }: { configEntry: ConfigEntry; parameters: Params }) =>
      createConfigManager(configEntry, {
        ...parameters,
        env: 'production',
        buildType: 'client',
        port: detectPortSync(parameters.port ?? DEFAULT_PORT),
        staticPort: detectPortSync(parameters.staticPort ?? DEFAULT_STATIC_PORT),
      }),
    deps: {
      configEntry: CONFIG_ENTRY_TOKEN,
      parameters: COMMAND_PARAMETERS_TOKEN,
    },
  }),
  provide({
    provide: SERVER_PROCESS_TOKEN,
    useFactory: ({ configManager, parameters }) => {
      const { env } = parameters;
      const serverConfigManager = (
        configManager as ConfigManager<ApplicationConfigEntry>
      ).withSettings({
        buildType: 'server',
      });
      const { debug, port, staticPort, staticHost, output } = serverConfigManager;
      const root = serverConfigManager.buildPath;

      return fork(path.resolve(root, 'server.js'), [], {
        execArgv: debug ? DEBUG_ARGV : [],
        cwd: root,
        env: {
          ...safeRequire(path.resolve(process.cwd(), 'env.development'), true),
          ...safeRequire(path.resolve(process.cwd(), 'env'), true),
          ...env,
          ...process.env,
          NODE_ENV: 'production',
          PORT: `${port}`,
          PORT_SERVER: `${port}`,
          ASSETS_PREFIX:
            process.env.ASSETS_PREFIX ??
            `http://${staticHost}:${staticPort}/${output.client.replace(/\/$/, '')}/`,
        },
      });
    },
    deps: {
      configManager: CONFIG_MANAGER_TOKEN,
      parameters: COMMAND_PARAMETERS_TOKEN,
    },
  }),
  provide({
    provide: CLOSE_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ serverProcess }) => {
      return async () => {
        return new Promise<void>((resolve) => {
          serverProcess.once('exit', () => {
            resolve();
          });

          serverProcess.kill();
        });
      };
    },
    deps: {
      serverProcess: SERVER_PROCESS_TOKEN,
    },
  }),
] as const;
