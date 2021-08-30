import { createToken } from '@tinkoff/dippy';
import type { Compiler, MultiCompiler } from 'webpack';
import type Config from 'webpack-chain';
import type { ConfigManager } from '../../config/configManager';

export const CLIENT_CONFIG_MANAGER_TOKEN = createToken<ConfigManager>('build clientConfigManager');
export const CLIENT_MODERN_CONFIG_MANAGER_TOKEN = createToken<ConfigManager>(
  'build clientConfigModernManager'
);
export const SERVER_CONFIG_MANAGER_TOKEN = createToken<ConfigManager>('build serverConfigManager');

export const WEBPACK_CLIENT_CONFIG_TOKEN = createToken<Config>('build webpackClientConfig');
export const WEBPACK_CLIENT_MODERN_CONFIG_TOKEN = createToken<Config>(
  'build webpackClientModernConfig'
);
export const WEBPACK_SERVER_CONFIG_TOKEN = createToken<Config>('build webpackServerConfig');

export const WEBPACK_COMPILER_TOKEN = createToken<MultiCompiler>('build webpackCompiler');
export const WEBPACK_CLIENT_COMPILER_TOKEN = createToken<Compiler>('build webpackClientCompiler');
export const WEBPACK_CLIENT_MODERN_COMPILER_TOKEN = createToken<Compiler>(
  'build webpackClientModernCompiler'
);
export const WEBPACK_SERVER_COMPILER_TOKEN = createToken<Compiler>('build webpackServerCompiler');

export const INIT_HANDLER_TOKEN = createToken<Array<() => Promise<void>>>('build initHandler', {
  multi: true,
});

export const PROCESS_HANDLER_TOKEN = createToken<Array<() => Promise<void>>>(
  'build processHandler',
  {
    multi: true,
  }
);

export const CLOSE_HANDLER_TOKEN = createToken<Array<() => Promise<void>>>('build closeHandler', {
  multi: true,
});
