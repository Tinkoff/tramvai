# Papi

Papi - API роуты для `tramvai` приложения. Функционал входит в модуль [@tramvai/module-server](references/modules/server.md)

## Explanation

Зачастую приложению нужны микросервисы, которые могут обрабатывать запрос пользователей и отдавать JSON ответы. Именно для решения этих кейсов были разработаны PAPI. PAPi позволяет реализовать обработчики запросов которые могут запросить клиенты и получить ответ в произвольном формате, к примеру JSON. PAPI позволяет быстро и дешево реализовать обработчики, не поднимая дополнительные микросервисы.

Связанные с papi разделы

- [Как получить данные с papi](#Как-получить-данные-с-papi)
- [Как можно получать данные с DI в papi роутах](#Как-можно-получать-данные-с-DI-в-papi-роутах)
- [Как добавить новый papi роут в приложении](#Как-добавить-новый-papi-роут-в-приложении)

## How to

### Как получить данные с papi

`papi` доступно за урлом `/${appInfo.appName}/papi`. Такой урл выбран потому, что бы разделить множество различных papi сервисов на 1 домене приложении.

Для примера выше с добавление роута, итоговый урл будет выглядеть так: `/${appInfo.appName}/papi/test` где appName это название переданное в `createApp`

Что бы сделать запрос, необходимо использовать `PAPI_SERVICE` из модуля `@tramvai/module-http-client` который автоматически на клиенте сделает http запрос к papi а на сервере просто вызовет функцию handler

### Как можно получать данные с DI в papi роутах

Для papi-обработчика есть возможность задать зависимости которые требуются ему для работы. При этом для каждого вызова будет создан отдельный дочерний di-container что позволит использовать как `SIGNLETON` так и `REQUEST` зависимости.

```tsx
import { Module, provide } from '@tramvai/core';
import { CREATE_CACHE_TOKEN } from '@tramvai/module-common';
import { HTTP_CLIENT } from '@tramvai/module-http-client';
import { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/module-server';
import { createPapiMethod } from '@tramvai/papi';

@Module({
  providers: [
    provide({
      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
      multi: true,
      useFactory: ({ createCache }) => {
        const cache = createCache(); // cache должен быть общий для всез вызовов handler, поэтому вызываем его за пределеами createPapiMethod

        return createPapiMethod({
          path: '/my/papi',
          method: 'post',
          async handler({ httpClient }) {
            // используем то, что запросили в deps из createPapiMethod
            if (cache.has('test')) {
              return 'test';
            }

            const { payload } = await httpClient.get('fake');
            return payload;
          },
          deps: {
            httpClient: HTTP_CLIENT, // эту же зависимость надо пересоздать для каждого вызова и они должны быть независимы
          },
        });
      },
      deps: {
        createCache: CREATE_CACHE_TOKEN, // это зависимость из рутового контейнера, котоарая будет создана только один раз
      },
    }),
  ],
})
export class PapiTestModule {}
```

### Как добавить новый papi роут в приложении

Существует два способа задания роутов. 1 - основываясь на файловой структуре, 2 - задание через провайдеров

#### Используя file api подход

Самый простой способ создать PAPI роут, это создать в корне проекта директорию `papi` в которую положить TS файлы с обработчиками. Название файлов будет являться урлом до роута.

Например: мы хотим создать новый papi обработчик, который читает body запросов и суммирует пришедшие значения. Для этого создаем файл /papi/getSum.ts с содержимым:

<p>
<details>
<summary>содержимое getSum.ts</summary>

@inline ../../../examples/how-to/server-add-file-api/papi/getSum.ts

</details>
</p>

Этот файл можно будет запросить с помощью papi клиента, либо вызвав урл `/${appName}/papi/getSum`

#### Используя провайдеры

Необходимо добавить multi провайдер `SERVER_MODULE_PAPI_PUBLIC_ROUTE` в котором добавить новые papi роуты

```tsx
import { createPapiMethod } from '@tramvai/papi';
import { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/tokens-server';
import { provide } from '@tramvai/core';

@Module({
  providers: [
    provide({
      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
      multi: true,
      useValue: createPapiMethod({
        method: 'get', // метод, может быть post, all и так далее
        path: '/test', // путь по которому будет доступен роут
        async handler(req, res): Promise<any> {
          // функция которая будет вызываться, если придут запросы на урл
          return new Promise({ test: true });
        },
      }),
    }),
  ],
})
export class PapiTestModule {}
```

И после этого будет доступен роут test
