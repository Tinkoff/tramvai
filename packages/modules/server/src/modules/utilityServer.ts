import { SERVER_TOKEN, UTILITY_SERVER_PORT_TOKEN } from '@tramvai/tokens-server';
import {
  SERVER_FACTORY_TOKEN,
  UTILITY_SERVER_TOKEN,
  UTILITY_WEB_FASTIFY_APP_TOKEN,
  WEB_FASTIFY_APP_FACTORY_TOKEN,
  WEB_FASTIFY_APP_TOKEN,
} from '@tramvai/tokens-server-private';
import { ENV_MANAGER_TOKEN, ENV_USED_TOKEN, LOGGER_TOKEN } from '@tramvai/tokens-common';
import { Module, createToken, provide, Scope, commandLineListTokens } from '@tramvai/core';

const IS_CUSTOM_SERVER_TOKEN = createToken<boolean>('server utility isCustomServer');

@Module({
  providers: [
    provide({
      provide: ENV_USED_TOKEN,
      multi: true,
      useValue: [{ key: 'UTILITY_SERVER_PORT', optional: true }],
    }),
    provide({
      provide: UTILITY_SERVER_PORT_TOKEN,
      useFactory: ({ envManager }) => {
        return +(envManager.get('UTILITY_SERVER_PORT') || envManager.get('PORT'));
      },
      deps: {
        envManager: ENV_MANAGER_TOKEN,
      },
    }),
    provide({
      provide: IS_CUSTOM_SERVER_TOKEN,
      useFactory: ({ port, envManager }) => {
        return +envManager.get('PORT') !== port;
      },
      deps: {
        envManager: ENV_MANAGER_TOKEN,
        port: UTILITY_SERVER_PORT_TOKEN,
      },
    }),
    provide({
      provide: UTILITY_SERVER_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: ({ isCustomServer, serverFactory, server }) => {
        return isCustomServer ? serverFactory() : server;
      },
      deps: {
        isCustomServer: IS_CUSTOM_SERVER_TOKEN,
        server: SERVER_TOKEN,
        serverFactory: SERVER_FACTORY_TOKEN,
      },
    }),
    provide({
      provide: UTILITY_WEB_FASTIFY_APP_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: ({ isCustomServer, app, appFactory, server }) => {
        return isCustomServer ? appFactory({ server }) : app;
      },
      deps: {
        isCustomServer: IS_CUSTOM_SERVER_TOKEN,
        app: WEB_FASTIFY_APP_TOKEN,
        appFactory: WEB_FASTIFY_APP_FACTORY_TOKEN,
        server: UTILITY_SERVER_TOKEN,
      },
    }),

    provide({
      provide: commandLineListTokens.listen,
      multi: true,
      scope: Scope.SINGLETON,
      useFactory: ({ logger, isCustomServer, port, app, server }) => {
        return async function utilityServerListen() {
          if (!isCustomServer) {
            return;
          }

          const log = logger('server:utility');

          await app.ready();

          return new Promise<void>((resolve, reject) => {
            server.once('error', (error) => {
              log.error({ event: 'server-listen-port', error });
              reject(error);
            });

            server.listen(port, () => {
              log.warn({ event: 'server-listen-port', message: `Server listen ${port} port` });
              resolve();
            });
          });
        };
      },
      deps: {
        logger: LOGGER_TOKEN,
        isCustomServer: IS_CUSTOM_SERVER_TOKEN,
        port: UTILITY_SERVER_PORT_TOKEN,
        app: UTILITY_WEB_FASTIFY_APP_TOKEN,
        server: UTILITY_SERVER_TOKEN,
      },
    }),
  ],
})
export class UtilityServerModule {}
