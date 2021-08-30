---
id: universal
title: Разделение кода для сервера и клиента
---

Фреймворк tramvai и его базовые компоненты являются универсальными, и работают одинаково хорошо во всех окружениях. tramvai cli собирает код для сервера и для клиента в отдельные сборки. При этом, контролировать выполнение пользовательского кода в нужном окружении требуется вручную. Основные механизмы для этого - package.json, dependency injection и непосредственные проверки в коде на окружение.

Подробнее о том, как webpack выбирает нужные файлы для разных `target`, [в этой статье](https://www.jonathancreamer.com/how-webpack-decides-what-entry-to-load-from-a-package-json/).

Пользовательский код, который зависит от окружения, можно разделить на несколько видов:

- Код приложения
- npm библиотеки
- tramvai модули и DI провайдеры

### Код приложения

Для выполнения веток кода или в определенных окружения, можно использовать несколько проверок:

#### process.env

При сборке проекта tramvai cli проставляет две переменные, указывающие на окружение - `process.env.SERVER` и `process.env.BROWSER`. Webpack автоматически удалит код с условием, не соответствующим текущему окружению, например следующий код не попадет в серверный бандл:

```javascript
if (process.env.BROWSER) {
  console.log(window.innerWidth, window.innerHeight);
}
```

Для исключения кода из production сборки, независимо от окружения, можно использовать переменную `process.env.NODE_ENV`:

```javascript
if (process.env.NODE_ENV === 'development') {
  console.log('отладочная информация');
}
```

Для исключения импортируемых библиотек из сборки требуется замена верхнеуровневых `import` на `require` внутри условия:

```javascript
if (process.env.BROWSER) {
  const logger = require('@tinkoff/logger');
  const log = logger('debug');

  log.info(window.location.href);
}
```

#### typeof window

Для дополнительных оптимизаций, используется [babel плагин](https://github.com/FormidableLabs/babel-plugin-transform-define), который превращает `typeof window` из серверной сборке в `'undefined'`, а из клиентской - в `'object'`, что позволяет webpack'у вырезать лишний код, например следующее условие работает аналогично проверке `process.env.BROWSER`:

```javascript
if (typeof window !== 'undefined') {
  console.log(window.innerWidth, window.innerHeight);
}
```

#### package.json

Если нам потребовалось заменять целый файл, а не определенные строки кода, можно вынести его в отдельную папку, описать реализацию для всех окружений, и добавить `package.json`:

```javascript
// module.server.js
export const CONSTANT = 'SERVER_SIDE';
```

```javascript
// module.client.js
export const CONSTANT = 'CLIENT_SIDE';
```

Далее, в `package.json` надо указать бандлеру, какой код использовать для разных окружений. Поле `main` используется для серверного бандла, а `browser` для клиентского:

```json
{
  "main": "./module.server.js",
  "browser": "./module.client.js"
}
```

### npm библиотеки

Для создания библиотеки, реализации которой должны отличаться на сервере и клиенте, необходимо поддерживать общий интерфейс экспорта, и настроить `package.json` аналогично предыдущему примеру. Например, библиотека экспортирует класс `Library`, и константу `LIBRARY_CONSTANT`.

Создадим две точки входа в нашу библиотеку - `server.js` и `client.js`:

```javascript
// server.js
export class Library {
  constructor() {
    // ...
  }
}

export const LIBRARY_CONSTANT = 'SERVER_SIDE_LIBRARY';
```

```javascript
// client.js
export class Library {
  constructor() {
    // ...
  }
}

export const LIBRARY_CONSTANT = 'CLIENT_SIDE_LIBRARY';
```

Далее, в `package.json` надо указать бандлеру, какой код использовать для разных окружений. Поле `main` используется для серверного бандла, а `browser` для клиентского:

```json
{
  "name": "library",
  "version": "0.1.0",
  "main": "server.js",
  "browser": "client.js",
  "dependencies": { ... }
}
```

После публикации библиотеки, можно импортировать ее в tramvai приложение, и не заботиться о том, какую именно реализацию мы получим:

```javascript
import { LIBRARY_CONSTANT } from 'library';

// при запуске приложения через tramvai start, увидим 'SERVER_SIDE_LIBRARY' в терминале, и 'CLIENT_SIDE_LIBRARY' в консоли браузера
console.log(LIBRARY_CONSTANT);
```

### tramvai модули

Новый функционал в tramvai приложение добавляется с помощью модулей, и как правило, поведение этих модулей кардинально отличается в разных окружениях, например:

- Рендеринг приложения в строку на сервере и гидрация реального DOM на клиенте
- Запуск https сервера
- Инициализация service worker'а

По этой причине, в репозитории tramvai, стандартный шаблон tramvai модуля, генерируемый через команду `npm run generate:module`, сразу разделяет точки входа в модуль на `server.js` и `client.js` , с помощью `package.json`.

Разберем это на примере создания модуля, который добавляет в приложение сервис для работы с `cookie`:

Этот сервис должен иметь общий интерфейс:

```tsx
export interface ICookie {
  get(key);
  set(key, value);
}
```

И разные реализации для серверного и клиентского окружения:

```tsx
// src/cookie.server.ts
// серверная реализация требует объекты Request и Response для работы с куками
export class Cookie implements ICookie {
  constructor({ req, res }) {
    // ...
  }
  get(key) {
    // ...
  }
  set(key, value) {
    // ...
  }
}
```

```tsx
// src/cookie.client.ts
// клиентская реализация обращается напрямую к объекту Window
export class Cookie implements ICookie {
  get(key) {
    // ...
  }
  set(key, value) {
    // ...
  }
}
```

Добавляем сервис в DI с помощью модулей:

```tsx
// src/server.ts
import { Module, Scope, provide } from '@tramvai/core';
import { REQUEST, RESPONSE } from '@tramvai/tokens-common';
import { Cookie } from './cookie.server';

@Module({
  providers: [
    provide({
      provide: 'cookie',
      useClass: Cookie,
      scope: Scope.REQUEST,
      deps: {
        req: REQUEST,
        res: RESPONSE,
      },
    }),
  ],
})
export class CookieModule {}
```

```tsx
// src/client.ts
import { Module, Scope, provide } from '@tramvai/core';
import { Cookie } from './cookie.client';

@Module({
  providers: [
    provide({
      provide: 'cookie',
      useClass: Cookie,
      scope: Scope.SINGLETON,
    }),
  ],
})
export class CookieModule {}
```

Настраиваем `package.json`:

```json
{
  "name": "@tramvai/module-cookie",
  "version": "0.1.0",
  "main": "lib/server.js",
  "browser": "lib/client.js",
  "dependencies": { ... }
}
```

После импорта модуля в приложение, мы получаем универсальный доступ к cookies, и не думаем про окружение, при использовании:

```tsx
import { createApp, commandLineListTokens, provide } from '@tramvai/core';
import { CookieModule } from '@tramvai/module-cookie';

createApp({
  name: 'app',
  modules: [
    // ...
    CookieModule,
  ],
  providers: [
    // ...
    provide({
      provide: commandLineListTokens.init,
      useFactory: ({ cookie }) => {
        console.log('wuid', cookie.get('wuid'));
      },
      deps: {
        cookie: 'cookie',
      },
    }),
  ],
  // ...
});
```
