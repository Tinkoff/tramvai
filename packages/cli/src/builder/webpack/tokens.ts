import { createToken } from '@tinkoff/dippy';
import type { Compiler, MultiCompiler, Watching } from 'webpack';
import type Config from 'webpack-chain';
import type { EventEmitter } from 'events';
import type { ConfigManager } from '../../config/configManager';
import type { GetBuildStats } from '../../typings/build/Builder';
import type { AnalyzePlugin } from './types';

export const CLIENT_CONFIG_MANAGER_TOKEN = createToken<ConfigManager>(
  'builder-webpack clientConfigManager'
);
export const CLIENT_MODERN_CONFIG_MANAGER_TOKEN = createToken<ConfigManager>(
  'builder-webpack clientModernConfigManager'
);
export const SERVER_CONFIG_MANAGER_TOKEN = createToken<ConfigManager>(
  'builder-webpack serverConfigManager'
);
export const WEBPACK_CLIENT_CONFIG_TOKEN = createToken<Config>('builder-webpack clientConfig');

export const WEBPACK_CLIENT_MODERN_CONFIG_TOKEN = createToken<Config>(
  'builder-webpack clientModernConfig'
);
export const WEBPACK_SERVER_CONFIG_TOKEN = createToken<Config>('builder-webpack serverConfig');

export const WEBPACK_COMPILER_TOKEN = createToken<MultiCompiler>('builder-webpack webpackCompiler');

export const WEBPACK_CLIENT_COMPILER_TOKEN = createToken<Compiler>(
  'builder-webpack webpackClientCompiler'
);

export const WEBPACK_CLIENT_MODERN_COMPILER_TOKEN = createToken<Compiler>(
  'builder-webpack webpackClientModernCompiler'
);
export const WEBPACK_SERVER_COMPILER_TOKEN = createToken<Compiler>(
  'builder-webpack webpackServerCompiler'
);

export const WEBPACK_WATCHING_TOKEN = createToken<Watching>('builder-webpack webpackWatching');

/**
 * Statistics about compilation - timing of the build etc.
 */
export const GET_BUILD_STATS_TOKEN = createToken<GetBuildStats>('builder-webpack getBuildStats');

export const EVENT_EMITTER_TOKEN = createToken<EventEmitter>('builder-webpack eventsEmitter');

export const WEBPACK_ANALYZE_PLUGIN_NAME_TOKEN = createToken<string>(
  'builder-webpack analyzePlugin name'
);
export const WEBPACK_ANALYZE_PLUGIN_TOKEN = createToken<AnalyzePlugin>(
  'builder-webpack analyzePlugin'
);

export const INIT_HANDLER_TOKEN = createToken<() => Promise<void>>('builder-webpack initHandler', {
  multi: true,
});
export const PROCESS_HANDLER_TOKEN = createToken<() => Promise<void>>(
  'builder-webpack processHandler',
  { multi: true }
);

export const CLOSE_HANDLER_TOKEN = createToken<() => Promise<void>>(
  'builder-webpack closeHandler',
  { multi: true }
);
