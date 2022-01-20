# Log

Модуль добавляет реализацию токена `LOGGER_TOKEN` на основе библиотеки [@tinkoff/logger](references/libs/logger.md).

## Подключение

Подключается в модуле `@tramvai/module-common`

## Пример

```tsx
import { Module, commandLineListToken, provide } from '@tramvai/core';
import { LOGGER_TOKEN } from '@tramvai/module-common';

@Module({
  providers: [
    provide({
      provide: commandLineListToken.customerStart,
      useFactory: ({ logger }) => {
        logger.debug('customer start'); // логгирование в глобальном пространстве логов

        const myLogger = logger({
          name: 'test',
        });

        myLogger.warn('warning'); // логгирование в пространстве test
        myLogger.error('error!');
      },
      deps: {
        logger: LOGGER_TOKEN,
      },
    }),
  ],
})
export class MyModule {}
```

## Отображение логов

см. [@tinkoff/logger](../libs/logger#отображение-логов).

> По умолчанию на сервере включены все логи уровня warn и выше. На клиенте в дев-режиме включены логи error и выше, в прод-режиме отображение каких-либо логов отключено.

## Отправка логов на апи

Предполагается что логи с сервера собираются через отдельный механизм, который имеет доступ к выводу консоли сервера и поэтому в логгировании на внешнее апи нет смысла.

В браузере логи на апи отправляются с помощью [RemoteReporter](../libs/logger.md#remotereporter). По умолчанию отправляются все логи уровня `error` и `fatal`. Урл апи определяется из переменной окружения `FRONT_LOG_API`. Для индивидуальной настройки смотри документацию к [RemoteReporter](../libs/logger.md#remotereporter).

## Просмотр логов с сервера в браузере

Данная функция доступна в дев режиме и создана для упрощения работы с логами при разработке.

В консоли браузера при заходе на страницу приложения появится специальная группа логов, под тегом `Tramvai SSR Logs` при раскрытии логов будут отображены логи которые были залогированы для даного конретного запроса на сервера, причем будут отображены именно те логи, которые подпадают под настройки [отображения для сервера](#отображение-логов-на-сервере). Если необходимо отобразить все логи с сервера с настройками [отображения для клиента](#отображение-логов-в-браузере), то нужно запустить сервер с переменной окружения `DEBUG_FULL_SSR`

## Просмотр логов для запросов на основе [@tinkoff/request](https://tinkoff.github.io/tinkoff-request/)

Логгер и настройки для него должны явно передаваться в [плагин логгирования](https://tinkoff.github.io/tinkoff-request/docs/plugins/log.html), что уже делается в [http-client](references/modules/http-client.md).

В плагине используется генерация тега для логгера в виде `request.${name}` поэтому чтобы отобразить такие необходимо настроить фильтры для отображения для конкретной фабрики запросов:

```tsx
const logger = di.get(LOGGER_TOKEN);
const makeRequest = request([...otherPlugins, logger({ name: 'my-api-name', logger })]);
```

Т.к. имя для логгера равно `my-api-name`, то для отображения логов необходимо:

- на сервере дополнить переменную окружения `LOG_ENABLE: 'request.my-api-name'`
- на клиенте включить логгирование через вызов `logger.enable('request.my-api-name')`

## Как правильно форматировать логи

Смотри [Как правильно логгировать](../libs/logger.md#как-правильно-логгировать)

## Экспортируемые токены

### LOGGER_TOKEN

Сущность логгера. Заменяет стандартную реализацию `LOGGER_TOKEN` из [@tramvai/module-common](references/modules/common.md)

## Изменение серверных настроек логгера

По умолчанию, настройки отображения логгера на сервере берутся из переменной окружения `LOG_ENABLE`, а настройки уровня логирования из переменной окружения `LOG_LEVEL`

Для изменения этих настроек в рантайме существует papi роут `{app}/private/papi/logger`

Отображение логов меняется через query параметр `enable`, например:

```
https://localhost:3000/{app}/private/papi/logger?enable=request.tinkoff
```

Уровень логгирования меняется через query параметр `level`, например:

```
https://localhost:3000/{app}/private/papi/logger?level=warn
```

Вернуть настройки по умолчанию, из переменных окружения, можно с параметром `mode=default`:

```
https://localhost:3000/{app}/private/papi/logger?mode=default
```

## Переменные окружения

- `LOG_LEVEL` = trace | debug | info | warn | error | fatal - включает отображение логов для заданного уровня и все уровней выше. Пример:
  - если `LOG_LEVEL=info`, то будут отображаться все логи уровней info, warn, error, fatal
- `LOG_ENABLE` = `${name}` | `${level}:${name}` - позволяет включить отображение всех логов по определенному имени логгера или по определенному имени и уровню. Несколько вхождений передаются через запятую. Примеры:
  - если `LOG_ENABLE=server`, то будут отображены логи всех уровней с именем `server`
  - если `LOG_ENABLE=trace:server*`, то будут отображены только логи для `server` с уровнем `trace`
  - если `LOG_ENABLE=info:server,client,trace:shared`, то будут включены логи для заданных логгеров по правилам выше

## Отладка

Модуль использует логгер с идентификатором `ssr-logger`
