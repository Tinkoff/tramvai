# Module Server

Один из основных модулей Tramvai который реализует обработку HTTP запросов клиентов. В этом модули изолирована вся логика работы с ответами клиентам.

## Подключение

Необходимо установить `@tramvai/module-server` с помощью npm

```bash
npm i --save @tramvai/module-server
```

И подключить в проекте

```tsx
import { createApp } from '@tramvai/core';
import { ServerModule } from '@tramvai/module-server';

createApp({
  name: 'tincoin',
  modules: [ServerModule],
});
```

## Explanation

### Обработка запросов пользователей

Основной функционал модуля заключается в том, что-бы обработать запрос пользователя, запустить commandLine у tramvai приложения и забрать данные страницы с RESPONSE_MANAGER_TOKEN

### Проксирование запросов

В server модуле доступна функциональность, которая позволяет настроить проксирование урлов в приложение используя библиотеку [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware). Эта фича работает как в дев режиме, так и на проде

Для включения проксирования необходимо в корне проекта создать файл `proxy.conf.js` или `proxy.conf.json` который будет экспортировать объект-маппинг запросов, либо можно использовать токен PROXY_CONFIG_TOKEN.

#### Формат прокси-файла

##### Объект ключ-значение

```javascript
const testStand = 'https://example.org';

module.exports = {
  // ключ - path pattern для express который будет передан в app.use
  // значение может быть строкой, для того чтобы проксировать все урлы начинающиеся с /login/
  '/login/': testStand,
  // или может быть объектом конфига для [http-proxy](https://github.com/chimurai/http-proxy-middleware#http-proxy-options)
  '/test/': {
    target: testStand,
    auth: true,
    xfwd: true,
    ...
  }
};
```

##### Объект со свойствами context и target

```javascript
module.exports = {
  // context - аналогичен опции для [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware#context-matching)
  context: ['/login/', '/registration/', '/auth/papi/'],
  target: 'https://example.org',
  // разные дополнительные опции
  changeOrigin: true,
};
```

##### Массив со свойствами context и target

```json
[
  {
    "context": ["/a/", "/b/*/c/"],
    "target": "https://example.org"
  }
]
```

##### Используя провайдеры с помощью токена PROXY_CONFIG_TOKEN

```tsx
import { Scope, provide } from '@tramvai/core';
import { PROXY_CONFIG_TOKEN } from '@tramvai/tokens-server';

[
  provide({
    provide: PROXY_CONFIG_TOKEN,
    scope: Scope.SINGLETON,
    useValue: {
      context: ['/a/', '/b/*/c/'],
      target: 'https://example.org',
    },
    multi: true,
  }),
];
```

### Раздача статических файлов

В module-server встроен статический сервер, который позволяет раздавать статичные файлы пользователям.

Для раздачи файлов, необходимо в корне проекта создать директорию `public` в который поместить необходимые файлы. После этого все файлы будут доступны для запроса браузерами

_К примеру, мы хотим раздать sw.js файл из корня проекта:_ для этого создаем папку `public` в которой закидываем файл `sw.js`. Теперь на стороне клиента, мы сможем запросить данные с урла http://localhost:3000/sw.js. Так-же скорее всего нужны будут доработки на стороне CD, для того что бы скопировать папаку public на стенды.

Эта функция доступна так-же и на продакшене. Для этого необходимо в докер контейнер скопировать папку `public`

### PAPI

Papi - API роуты для `tramvai` приложения. Подробная информация доступна в разделе [Papi](features/papi/introduction.md)

### Эмуляция проблем с сетью/бэкендами в приложении

(функционал доступен только в dev режиме)

На сервере есть возможность увеличить время ответа всех запросов.

Для этого необходимо:

- стартануть приложение
- отправить post-запрос на `/private/papi/debug-http-request` с указанием задержки для запроса:

```shell script
curl --location --request POST 'http://localhost:3000/tincoin/private/papi/debug-http-request' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'delay=2000'
```

- проверить работу приложения. Внимание! после каждого перезапуска сервера настройки сбрасываются, поэтому после каждой пересборки надо обращаться к papi снова.
- отключить таймаут можно обратившись к тому же papi методом delete

```shell script
curl --location --request DELETE 'http://localhost:3000/tincoin/private/papi/debug-http-request'
```

### Логгирование запросов отправленных на сервере

В дев режиме все запросы отправленные через стандартные библиотеки `http` и `https` для nodejs логгируются под специальным ключом `node-debug.request`. Это позволяет увидеть все запросы которые были отправлены на сервере, даже если для запросов не было определено логгирование явно.

Чтобы включить такие логи, достаточно добавить в переменную окружения `DEBUG_ENABLE` ключ `node-debug.request`

### Health checks

- _`/healthz`_ - после старта приложения всегда отдает ответ `OK`
- _`/readyz`_ - после старта приложения всегда отдает `OK`

### Метрики

В модуль сервера автоматически подключен модуль метрик. Подробную информацию по метрикам, можете почитать [в документации метрик](references/modules/metrics.md)

### Прогрев кэшей приложения

В модуль сервера автоматически подключен модуль прогрева кэшей. Подробную информацию по прогреву кэшей, можете почитать [в документации cache-warmup](references/modules/cache-warmup.md)

### Специальные заголовки

#### Информация о сборке и деплое

В модуле проставляются особые заголовки, которые помогают определить точную информацию о версии собранного приложения, коммите, ветке и т.п.:

- _x-app-id_ - имя приложения указанного в `createApp`. Указывается в коде приложения.
- _x-host_ - hostname сервера на котором запущено текущее приложение. Вычисляется в рантайме.
- _x-app-version_ - версия запущенного приложения. Передаётся через переменную окружения `APP_VERSION` (внутри tinkoff проставляется в рамках стандартных пайплайнов gitlab ci).
- _x-deploy-branch_ - ветка с которой был собран текущий образ приложения. Передаётся через переменную окружения `DEPLOY_BRANCH` (внутри tinkoff проставляется с помощью unic).
- _x-deploy-commit_ - sha коммита с которого был собран текущий образ приложения. Передаётся через переменную окружения `DEPLOY_COMMIT` (внутри tinkoff проставляется с помощью unic).
- _x-deploy-version_ - номер ревизии деплоя в k8s. Передаётся через переменную окружения `DEPLOY_VERSION` (внутри tinkoff проставляется с помощью unic).
- _x-deploy-repository_ - ссылка на репозиторий приложения. Передаётся через переменную окружения `DEPLOY_REPOSITORY` (внутри tinkoff проставляется с помощью unic).

Для всех заголовков выше, которые передаются через переменные окружения, чтобы они были доступны, необходимо чтобы внешняя инфраструктура передавала их при сборке и деплое образа приложения (внутри tinkoff это делается автоматически).

## Отладка

Модуль использует логгеры с идентификаторами: `server`, `server:static`, `server:webapp`, `server:node-debug:request`

## Экспортируемые токены

[ссылка](references/tokens/server-tokens.md)
