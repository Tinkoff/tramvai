import { Module } from '@tramvai/core';
import { CommonModule, ENV_MANAGER_TOKEN, ENV_USED_TOKEN } from '@tramvai/module-common';
import { SpaRouterModule } from '@tramvai/module-router';
import { RenderModule } from '@tramvai/module-render';
import { ServerModule } from '@tramvai/module-server';
import { LogModule } from '@tramvai/module-log';
import { HttpClientModule, HTTP_CLIENT_FACTORY } from '@tramvai/module-http-client';
import { MockerModule } from '@tramvai/module-mocker';
import { FAKE_API_CLIENT } from './fakeApiClient';

@Module({
  providers: [
    {
      provide: ENV_USED_TOKEN,
      multi: true,
      useValue: [
        {
          key: 'FAKE_API',
        },
      ],
    },
    {
      provide: FAKE_API_CLIENT,
      useFactory: ({ factory, envManager }) => {
        return factory({
          name: 'fake-api',
          baseUrl: envManager.get('FAKE_API'),
        });
      },
      deps: {
        factory: HTTP_CLIENT_FACTORY,
        envManager: ENV_MANAGER_TOKEN,
      },
    },
  ],
})
class FakeApiModule {}

export const modules = [
  // CommonModule содержит все необходимые стандартные реализации (di, pubsub, hooks, actions, context)
  // и поэтому должен подключаться в любом приложении и должен стоять на первом месте, чтобы правильно работало перепределение функционала
  // если оно понадобится в модулях ниже
  CommonModule,
  // модуль логгирования, CommonModule определяет в себе простейшую реализацию и поэтому этот модуль необязателен, но
  // в отличии от реализации в CommonModule этим логгером можно управлять и настраивать фильтры отображения
  LogModule,
  // модуль роутинга который позволяет получать конфиг для текущей страницы и осуществлять spa-переходы
  // необходим в любом случае т.к. на роут завязан модуль рендера и множество других роутов
  // роуты можно задавать статично или они могут загружаться из админки
  SpaRouterModule.forRoot([
    {
      name: 'main',
      path: '/',
    },
  ]),
  // модуль рендера который позволит отрендерить реакт-приложение
  RenderModule,
  // модуль для работы сервера: использует RenderModule для рендера страниц
  // добавляет функциональность papi-методов
  ServerModule,
  // Модуль для работы с апи
  HttpClientModule,
  // Модуль с готовым HTTP клиентом
  FakeApiModule,
  // Модуль для мокирования запросов в апи
  MockerModule,
];
