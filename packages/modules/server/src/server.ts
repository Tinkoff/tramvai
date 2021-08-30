import {
  Module,
  Scope,
  commandLineListTokens,
  COMMAND_LINE_RUNNER_TOKEN,
  APP_INFO_TOKEN,
} from '@tramvai/core';
import {
  SERVER_TOKEN,
  WEB_APP_TOKEN,
  WEB_APP_INIT_TOKEN,
  WEB_APP_BEFORE_INIT_TOKEN,
  WEB_APP_AFTER_INIT_TOKEN,
} from '@tramvai/tokens-server';
import { ENV_MANAGER_TOKEN, ENV_USED_TOKEN, LOGGER_TOKEN } from '@tramvai/module-common';
import { MetricsModule } from '@tramvai/module-metrics';
import { CacheWarmupModule } from '@tramvai/module-cache-warmup';
import { serverFactory, serverListenCommand } from './server/server';
import { webAppFactory, webAppInitCommand } from './server/webApp';
import { staticAppCommand } from './server/static';
import { xHeadersFactory } from './server/xHeaders';
import * as modules from './modules';

export * from '@tramvai/tokens-server';

@Module({
  imports: [
    MetricsModule,
    CacheWarmupModule,
    modules.ServerPapiModule,
    modules.ServerStaticsModule,
    modules.ServerGracefulShutdownModule,
    modules.ServerProxyModule,
    modules.DependenciesVersionModule,
    process.env.NODE_ENV !== 'production' && modules.DebugHttpRequestsModule,
  ].filter(Boolean),
  providers: [
    {
      provide: WEB_APP_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: webAppFactory,
    },
    {
      provide: commandLineListTokens.init,
      multi: true,
      useFactory: webAppInitCommand,
      deps: {
        app: WEB_APP_TOKEN,
        logger: LOGGER_TOKEN,
        commandLineRunner: COMMAND_LINE_RUNNER_TOKEN,
        beforeInit: { token: WEB_APP_BEFORE_INIT_TOKEN, optional: true },
        init: { token: WEB_APP_INIT_TOKEN, optional: true },
        afterInit: { token: WEB_APP_AFTER_INIT_TOKEN, optional: true },
      },
    },
    {
      provide: SERVER_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: serverFactory,
      deps: {
        webApp: WEB_APP_TOKEN,
      },
    },
    {
      provide: commandLineListTokens.listen,
      multi: true,
      useFactory: serverListenCommand,
      deps: {
        server: SERVER_TOKEN,
        logger: LOGGER_TOKEN,
        envManager: ENV_MANAGER_TOKEN,
      },
    },
    {
      provide: commandLineListTokens.listen,
      multi: true,
      useFactory: staticAppCommand,
      deps: {
        logger: LOGGER_TOKEN,
        envManager: ENV_MANAGER_TOKEN,
        appInfo: APP_INFO_TOKEN,
      },
    },
    {
      provide: ENV_USED_TOKEN,
      multi: true,
      useValue: [
        { key: 'DEV_STATIC', optional: true, dehydrate: false },
        { key: 'PORT_STATIC', optional: true, dehydrate: false, value: 4000 },
        { key: 'PORT', optional: true, dehydrate: false, value: 3000 },
      ],
    },
    {
      provide: WEB_APP_BEFORE_INIT_TOKEN,
      multi: true,
      useFactory: xHeadersFactory,
      deps: {
        app: WEB_APP_TOKEN,
        envManager: ENV_MANAGER_TOKEN,
        appInfo: APP_INFO_TOKEN,
      },
    },
  ],
})
export class ServerModule {}
