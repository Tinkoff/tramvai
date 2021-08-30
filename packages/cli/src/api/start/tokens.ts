import type { StoppableServer } from 'stoppable';
import { createToken } from '@tinkoff/dippy';
import type { MultiCompiler, Compiler, Watching } from 'webpack';
import type Config from 'webpack-chain';
import type { ConfigManager } from '../../config/configManager';

export const CLIENT_CONFIG_MANAGER_TOKEN = createToken<ConfigManager>('start clientConfigManager');
export const SERVER_CONFIG_MANAGER_TOKEN = createToken<ConfigManager>('start serverConfigManager');

export const WEBPACK_CLIENT_CONFIG_TOKEN = createToken<Config>('start webpackClientConfig');
export const WEBPACK_SERVER_CONFIG_TOKEN = createToken<Config>('start webpackServerConfig');
export const WEBPACK_COMPILER_TOKEN = createToken<MultiCompiler>('start webpackCompiler');

export const WEBPACK_WATCHING_TOKEN = createToken<Watching>('start webpackWatching');

export const WEBPACK_CLIENT_COMPILER_TOKEN = createToken<Compiler>('start webpackClientCompiler');
export const WEBPACK_SERVER_COMPILER_TOKEN = createToken<Compiler>('start webpackServerCompiler');

export const SERVER_TOKEN = createToken<StoppableServer>('start server');

export const STATIC_SERVER_TOKEN = createToken<StoppableServer>('start staticServer');

export const INIT_HANDLER_TOKEN = createToken<Array<() => Promise<void>>>('start initHandler', {
  multi: true,
});

export const PROCESS_HANDLER_TOKEN = createToken<Array<() => Promise<void>>>(
  'start processHandler',
  {
    multi: true,
  }
);
export const CLOSE_HANDLER_TOKEN = createToken<Array<() => Promise<void>>>('start closeHandler', {
  multi: true,
});

export const STRICT_ERROR_HANDLE = createToken<boolean>('start strictErrorHandle');
