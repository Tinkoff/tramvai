# module-loader-client

Загрузчик модулей для браузерного окружения. Загружает js по урлу опционально вместе с css. Встроена дедубликация загрузки через атрибут скрипта `loaded`.

## Установка

Для yarn:

```shell script
yarn add @tinkoff/module-loader-client
```

Для npm:

```shell script
npm install @tinkoff/module-loader-client
```

## Подключение и использование

### `loadModule`

В loadModule встроена дедубликация загрузки через поиск уже вставленного скрипта с тем же урлом, что позволяет инициировать загрузку скриптов на этапе разбора html, в этом случае вы должны самостоятельно навесить атрибут `loaded` скрипту, чтобы метод `loadModule` понимал загружен скрипт или еще нет:

```html
<script
  src="https://cdn.example.com/bundle.js"
  onload="this.setAttribute('loaded', true)"
  onerror="this.setAttribute('loaded', 'error')"
/>
```

Пример использования:

```javascript
import { loadModule } from '@tinkoff/module-loader-client';

loadModule('https://cdn.example.com/js/module.js', {
  cssUrl: 'https://cdn.example.com/js/module.css', // опционально
}).then(() => {
  // ...
});
```

### `addScript`

Вставляет тег `script` без какой-либо допольнительной логике по дедубликации:

```javascript
import { addScript } from '@tinkoff/module-loader-client';

addScript(src, maybeAttrs, maybeScriptHandler).then(() => something());
```

Коллбэк вызывается сихронно, в который передается непосредственно script элемент.

### `addLink`

Вставляет тег `link` без какой-либо допольнительной логике по дедубликации:

```javascript
import { addLink } from '@tinkoff/module-loader-client';

addLink(type, href, maybeAttrs).then(() => something());
```

## Интерфейс и типы

@inline src/types.h.ts
