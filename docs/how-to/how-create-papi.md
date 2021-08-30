---
id: how-create-papi
title: Как создать обработчик papi?
---

Рассмотрим на основе кейса: необходимо создать отдельный апи сервис который по урлу вида `${APP_ID}/papi/getSum` будет возвращать сумму переданных параметров a и b

## Автоматическое создание обработчика

На основе параметра конфигурации `application.commands.build.options.serverApiDir` в platform.json (по умолчанию папка `./src/api`) определяется директория, в которой хранятся papi-обработчики. Создаем в этой папке новый файл с именем нашего нового обработчика, т.е. `getSum.ts` для нашего примера. В качестве обработчика будет использован дефолтный экспорт из файла, создаем его:

```tsx
export default () => {
  return 'hello';
};
```

Перезапускаем сервер, чтобы новый обработчик добавился в список papi. Результат вызова функции будет использован как тело ответа, поэтому теперь если обратить по адресу `http://localhost:3000/tincoin/papi/getSum` то в ответе мы получим объект со свойством `payload: 'hello'`.

Далее добавим логику в наш обработчик:

```tsx
import { Req } from '@tramvai/papi'; // импорт нужен только для типизации, можно обойтись без него или использовать типы из express

export default (req: Req) => {
  const {
    body: { a, b },
    method,
  } = req; // получаем из объекта запроса всю необходимую ифнормацию

  if (method !== 'POST') {
    throw new Error('only post methods'); // выбрасываем ошибку, если хотим обрабатывать только определенные http-методы
  }

  if (!a || !b) {
    // проверяем что были переданы необходимые параметры запроса
    return {
      error: true,
      message: 'body parameters a and b should be set',
    };
  }

  return { error: false, result: +a + +b }; // возвращаем результат, не забыв сделать все преобразования над строками
};
```

Сборку уже перезапускать не нужно и @tramvai/cli сам все пересоберет после сохранения изменений на диск. Теперь можно сделать POST-запрос на `http://localhost:3000/tincoin/papi/getSum`, передать параметры `a` и `b` и получить результат.

## Создание обработчика через провайдер

При необходимости использовать в обработчике другие зависимости приложения из di, можно добавить провайдер с токеном `SERVER_MODULE_PAPI_PUBLIC_ROUTE`:

```tsx
// ...
import { createPapiMethod } from '@tramvai/papi';
import { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/tokens-server';
import { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { provide } from '@tramvai/core';

createApp({
  // ...
  providers: [
    // ...
    provide({
      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
      multi: true,
      useFactory: ({ logger }: { logger: typeof LOGGER_TOKEN }) => {
        const log = logger('ping-pong');

        return createPapiMethod({
          method: 'get',
          path: '/ping',
          async handler() {
            log.error('/ping requested'); // логируем с уровнем error, чтобы наверняка увидеть лог
            return 'pong';
          },
        });
      },
      deps: {
        logger: LOGGER_TOKEN,
      },
    }),
  ],
});
```

Теперь можно сделать запрос по адресу `http://localhost:3000/tincoin/papi/ping`, в ответе мы получим объект со свойством `payload: 'pong'`, а в терминале с запущенным процессом `tramvai start ${APP_ID}` увидим лог ошибки `/ping requested`.

### Дополнительные ссылки

- [Документация к ServerModule](references/modules/server.md)
