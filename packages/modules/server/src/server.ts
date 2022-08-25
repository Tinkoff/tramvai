import { setDefaultResultOrder } from 'dns';
import EventEmitter from 'events';
import {
  Module,
  Scope,
  commandLineListTokens,
  COMMAND_LINE_RUNNER_TOKEN,
  APP_INFO_TOKEN,
  provide,
} from '@tramvai/core';
import {
  SERVER_TOKEN,
  WEB_APP_TOKEN,
  WEB_APP_INIT_TOKEN,
  WEB_APP_BEFORE_INIT_TOKEN,
  WEB_APP_AFTER_INIT_TOKEN,
  WEB_APP_LIMITER_TOKEN,
} from '@tramvai/tokens-server';
import {
  WEB_FASTIFY_APP_TOKEN,
  WEB_FASTIFY_APP_BEFORE_INIT_TOKEN,
  WEB_FASTIFY_APP_AFTER_INIT_TOKEN,
  WEB_FASTIFY_APP_INIT_TOKEN,
  WEB_FASTIFY_APP_LIMITER_TOKEN,
  WEB_FASTIFY_APP_BEFORE_ERROR_TOKEN,
  WEB_FASTIFY_APP_AFTER_ERROR_TOKEN,
  WEB_FASTIFY_APP_PROCESS_ERROR_TOKEN,
  SERVER_FACTORY_TOKEN,
  WEB_FASTIFY_APP_FACTORY_TOKEN,
  WEB_FASTIFY_APP_METRICS_TOKEN,
} from '@tramvai/tokens-server-private';
import {
  ENV_MANAGER_TOKEN,
  ENV_USED_TOKEN,
  EXECUTION_CONTEXT_MANAGER_TOKEN,
  LOGGER_TOKEN,
} from '@tramvai/tokens-common';
import { MetricsModule } from '@tramvai/module-metrics';
import { CacheWarmupModule } from '@tramvai/module-cache-warmup';
import { serverFactory, serverListenCommand } from './server/server';
import { webAppExpressFactory, webAppFactory, webAppInitCommand } from './server/webApp';
import { staticAppCommand } from './server/static';
import { xHeadersFactory } from './server/xHeaders';
import * as modules from './modules';

export * from '@tramvai/tokens-server';

if (typeof setDefaultResultOrder === 'function') {
  setDefaultResultOrder('ipv4first');
}

// tramvai add a lot of "abort" event listeners to AbortSignal, but we can't configure only AbortSignal max listeners,
// because AbortSignal is not instance of EventEmitter - https://github.com/southpolesteve/node-abort-controller/blob/master/index.js
EventEmitter.defaultMaxListeners = 50;

@Module({
  imports: [
    MetricsModule,
    CacheWarmupModule,
    modules.ServerPapiModule,
    modules.ServerStaticsModule,
    modules.ServerGracefulShutdownModule,
    modules.ServerProxyModule,
    modules.DependenciesVersionModule,
    modules.UtilityServerModule,
    modules.KeepAliveModule,
    process.env.NODE_ENV !== 'production' && modules.DebugHttpRequestsModule,
  ].filter(Boolean),
  providers: [
    provide({
      provide: SERVER_FACTORY_TOKEN,
      scope: Scope.SINGLETON,
      useValue: serverFactory,
    }),
    provide({
      provide: SERVER_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: ({ factory }) => factory(),
      deps: {
        factory: SERVER_FACTORY_TOKEN,
      },
    }),
    provide({
      provide: WEB_FASTIFY_APP_FACTORY_TOKEN,
      scope: Scope.SINGLETON,
      useValue: webAppFactory,
    }),
    provide({
      provide: WEB_FASTIFY_APP_TOKEN,
      useFactory: ({ factory, server }) => factory({ server }),
      scope: Scope.SINGLETON,
      deps: {
        server: SERVER_TOKEN,
        factory: WEB_FASTIFY_APP_FACTORY_TOKEN,
      },
    }),
    provide({
      // BACKWARD: provide the express app as before
      provide: WEB_APP_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: webAppExpressFactory,
      deps: {
        webApp: WEB_FASTIFY_APP_TOKEN,
      },
    }),
    {
      provide: commandLineListTokens.init,
      multi: true,
      useFactory: webAppInitCommand,
      deps: {
        app: WEB_FASTIFY_APP_TOKEN,
        expressApp: WEB_APP_TOKEN,
        logger: LOGGER_TOKEN,
        commandLineRunner: COMMAND_LINE_RUNNER_TOKEN,
        executionContextManager: EXECUTION_CONTEXT_MANAGER_TOKEN,
        beforeInit: { token: WEB_FASTIFY_APP_BEFORE_INIT_TOKEN, optional: true },
        init: { token: WEB_FASTIFY_APP_INIT_TOKEN, optional: true },
        afterInit: { token: WEB_FASTIFY_APP_AFTER_INIT_TOKEN, optional: true },
        requestMetrics: { token: WEB_FASTIFY_APP_METRICS_TOKEN, optional: true },
        limiterRequest: { token: WEB_FASTIFY_APP_LIMITER_TOKEN, optional: true },
        expressBeforeInit: { token: WEB_APP_BEFORE_INIT_TOKEN, optional: true },
        expressInit: { token: WEB_APP_INIT_TOKEN, optional: true },
        expressAfterInit: { token: WEB_APP_AFTER_INIT_TOKEN, optional: true },
        expressLimiterRequest: { token: WEB_APP_LIMITER_TOKEN, optional: true },
        beforeError: { token: WEB_FASTIFY_APP_BEFORE_ERROR_TOKEN, optional: true },
        processError: { token: WEB_FASTIFY_APP_PROCESS_ERROR_TOKEN, optional: true },
        afterError: { token: WEB_FASTIFY_APP_AFTER_ERROR_TOKEN, optional: true },
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
        {
          key: 'APP_VERSION',
          dehydrate: true,
          optional: true,
          // обращаемся к process.env.APP_VERSION явно, чтобы вебпак заинлайнил его при сборке и версия вшилась в билд
          value: process.env.APP_VERSION,
        },
        { key: 'DEPLOY_BRANCH', optional: true, dehydrate: false },
        { key: 'DEPLOY_COMMIT', optional: true, dehydrate: false },
        { key: 'DEPLOY_VERSION', optional: true, dehydrate: false },
        { key: 'DEPLOY_REPOSITORY', optional: true, dehydrate: false },
      ],
    },
    {
      provide: WEB_FASTIFY_APP_INIT_TOKEN,
      multi: true,
      useFactory: xHeadersFactory,
      deps: {
        app: WEB_FASTIFY_APP_TOKEN,
        envManager: ENV_MANAGER_TOKEN,
        appInfo: APP_INFO_TOKEN,
      },
    },
  ],
})
export class ServerModule {}
