import { Module, commandLineListTokens, Scope, provide } from '@tramvai/core';
import { createPapiMethod } from '@tramvai/papi';
import { ENV_MANAGER_TOKEN, LOGGER_TOKEN } from '@tramvai/module-common';
import {
  SERVER_MODULE_PAPI_PUBLIC_ROUTE,
  SERVER_MODULE_PAPI_PUBLIC_URL,
} from '@tramvai/tokens-server';
import { Mocker, FileSystemMockRepository } from '@tinkoff/mocker';
import { MOCKER, MOCKER_REPOSITORY, MOCKER_CONFIGURATION } from './tokens';

export * from './tokens';

@Module({
  providers:
    process.env.MOCKER_ENABLED === 'true' || process.env.NODE_ENV === 'test'
      ? [
          provide({
            provide: commandLineListTokens.init,
            multi: true,
            useFactory: ({ mocker, mockerConfigFactory, envManager, papiPublicUrl, logger }) => {
              const log = logger('mocker');

              return async function mockerInit() {
                const apis = {};
                const mockerConfig = await mockerConfigFactory();

                mockerConfig.apis.forEach((env) => {
                  const api = env;
                  const target = envManager.get(env);
                  const mockedPath = `${papiPublicUrl}/mocker/${api}/`;
                  const serverMockedUrl = `http://localhost:${envManager.get('PORT')}${mockedPath}`;
                  const clientMockedUrl = `${mockedPath}`;

                  apis[api] = { target };

                  log.debug(
                    `Mock ${env} env variable, current value is ${target}, replaced value is ${serverMockedUrl} for server and ${clientMockedUrl} for client`
                  );

                  const serverMockedEnv = {
                    [env]: serverMockedUrl,
                  };
                  const clientMockedEnv = {
                    [env]: clientMockedUrl,
                  };

                  // заменяем текущие env переменные
                  envManager.update(serverMockedEnv);
                  // заменяем env переменные, которые получит клиентский код
                  // важно! не сработает для случаев, когда env из серверного кода попадает
                  // в клиентский код через inline скрипт, например `FRONT_LOG_API`
                  envManager.updateClientUsed(clientMockedEnv);
                  // на всякий случай заменяем env переменные в process
                  process.env = Object.assign(process.env, serverMockedEnv);
                });

                mocker.setApis(apis);

                return mocker.init();
              };
            },
            deps: {
              mocker: MOCKER,
              logger: LOGGER_TOKEN,
              mockerConfigFactory: MOCKER_CONFIGURATION,
              envManager: ENV_MANAGER_TOKEN,
              papiPublicUrl: SERVER_MODULE_PAPI_PUBLIC_URL,
            },
          }),
          {
            provide: MOCKER_REPOSITORY,
            scope: Scope.SINGLETON,
            multi: true,
            useFactory: () => {
              // @todo добавить возможность конфигурации путей до моков для FS резолвера
              const repository = new FileSystemMockRepository({
                cwd: process.cwd(),
                root: 'mocks',
              });

              return repository;
            },
          },
          provide({
            provide: MOCKER_CONFIGURATION,
            scope: Scope.SINGLETON,
            useFactory: ({ repositories }): typeof MOCKER_CONFIGURATION => {
              return async () => {
                const mocks = await Promise.all(repositories.map((repo) => repo.getAll()));

                const apis = {};

                mocks.forEach((mock) => {
                  Object.assign(apis, mock);
                });

                return {
                  apis: Object.keys(apis),
                };
              };
            },
            deps: {
              repositories: MOCKER_REPOSITORY,
            },
          }),
          provide({
            provide: MOCKER,
            scope: Scope.SINGLETON,
            useFactory: ({ repositories, logger }) => {
              const log = logger('mocker');

              return new Mocker({
                repositories,
                logger: log,
                appRoutePrefix: '/mocker',
                apiRoutePrefix: '/mocker-api',
                passUnhandledRequests: true,
              });
            },
            deps: {
              repositories: MOCKER_REPOSITORY,
              logger: LOGGER_TOKEN,
            },
          }),
          {
            provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
            multi: true,
            useFactory: ({ mocker }: { mocker: typeof MOCKER }) => {
              return createPapiMethod({
                method: 'all',
                path: '/mocker/*',
                options: {
                  respond: false,
                },
                async handler(req, res) {
                  mocker.use(req, res);
                },
              });
            },
            deps: {
              mocker: MOCKER,
            },
          },
          {
            provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
            multi: true,
            useFactory: ({ mocker }: { mocker: typeof MOCKER }) => {
              return createPapiMethod({
                method: 'all',
                path: '/mocker-api/*',
                options: {
                  respond: false,
                },
                async handler(req, res) {
                  mocker.useApi(req, res);
                },
              });
            },
            deps: {
              mocker: MOCKER,
            },
          },
        ]
      : [],
})
export class MockerModule {
  static forRoot({ config }: { config?: typeof MOCKER_CONFIGURATION }) {
    const providers = [];

    if (config) {
      providers.push({
        provide: MOCKER_CONFIGURATION,
        useValue: config,
      });
    }

    return {
      mainModule: MockerModule,
      providers,
    };
  }
}
