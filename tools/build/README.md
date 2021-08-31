# @tramvai/build

Библиотека предназначена для `production` сборки написанных на TypeScript пакетов под разные окружения:

- NodeJS
- Бандлеры (Webpack, etc.)
- Браузеры

## Подключение

Необходимо установить `@tramvai/build`:

```bash
yarn add @tramvai/build
```

Заполнить необходимые поля в `package.json`:

```json
{
  "main": "lib/index.js",
  "typings": "src/index.ts"
}
```

> `"main": "lib/index.js"` на основе этого поля вычисляется, что точка входа для сборки должна называться `"src/index.ts"`

> `"typings": "src/index.ts"` желательно должен указывать на точку входа, это удобно для монореп, т.к. не требует сборки пакета для его использования в других пакетах. После сборки для публикации это поле заменится на файл с собранными типами, в данном случае - `"typings": "lib/index.d.ts"`

И в `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "target": "ES5",
    "module": "CommonJS",
    "declaration": true,
    "importHelpers": true,
    "skipLibCheck": true,
    "rootDir": "./src",
    "outDir": "./lib",
    "declarationDir": "./lib"
  },
  "include": [
    "./src"
  ]
}
```

Добавить в `dependencies` библиотеку [tslib](https://www.npmjs.com/package/tslib):

```bash
yarn add tslib
```

Собрать пакет через команду `tramvai-build`:

```bash
tramvai-build --forPublish
```

> с флагом `--forPublish` tramvai-build заменяет некоторые поля в `package.json` на необходимые для корректного использования библиотеки в приложениях, например `"typings": "src/index.ts"` заменяется на `"typings": "lib/index.d.ts"`

## Explanation

Основное предназначение библиотеки - эффективная `production` сборка TypeScript пакетов с помощью [rollup](https://rollupjs.org/),
также поддерживается [watch](https://rollupjs.org/guide/en/#rollupwatch) режим.

Такие сборки, особенно при наличии большого количества пакетов в монорепозитории, могут занимать слишком много времени, и не подойдут для эффективной и удобной разработки.
По этой причине, для `development` окружения рекомендуется использовать [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html), с фичами [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) и [incremental build](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#faster-subsequent-builds-with-the---incremental-flag).

Рекомендуемый и автоматически генерируемый `package.json` для `@tramvai/build` позволяет приложениям использовать пакеты собранные и через `tsc`, и через `@tramvai/build`, без дополнительных действий.

Все собранные бандлы содержат код стандарта `ES2019`, ожидается то их будет резолвить бандлер (Webpac, etc.), для которого уже настроена транспиляция через `babel` пакетов в `node_modules`, написанных на современном JS, в код стандарта `ES5`.

### Бандл под NodeJS в CommonJS формате

NodeJS до 12 версии не поддерживает ES модули, либо поддерживает их под специальным флагом.
`@tramvai/build` генерирует бандл с кодом стандарта `ES2019`, в формате `CommonJS`, автоматически,
название итогового бандла берется из поля `main` в `package.json`, например `lib/index.js`.

При сборке нашего пакета в приложении через `webpack` с опцией `target: 'node'`, этот бандл скорее всего не будет использован,
т.к. в приоритете будет бандл из поля `module`.

> Ожидается, что этот бандл, из поля `"main"`, будет резолвить только NodeJS, а бандлеры (Webpac, etc.) предпочтут бандл из поля `"module"`

### Бандл под бандлеры (Webpack, etc.) в формате ES modules

Современные бандлеры (Webpac, etc.) поддерживают ES модули, и нестандартное поле `"module"` в `package.json`.
`@tramvai/build` генерирует бандл с кодом стандарта `ES2019`, в формате `ES modules`, автоматически,
название итогового бандла вычисляется из поля `main` в `package.json`, и добавляется суффикс `.es` например `lib/index.es.js`.

Если сборка произведена через `tramvai-build --forPublish`, в `package.json` добавится поле `"module": "lib/index.es.js"`.

При сборке нашего пакета в приложении через `webpack` с опцией `target: 'node'`, бандл из поля `module` будет иметь больший приоритет, чем поле `main`.

> Генерируется код стандарта `ES2019`, т.к. ожидается, что этот бандл, из поля `"module"`, будут резолвить бандлер (Webpac, etc.), для которого уже настроена транспиляция через `babel` пакетов в `node_modules`, написанных на современном JS, в код стандарта `ES5`.
> Почему мы не советуем оставлять `ES2019` код? Оказалось, что код в `ES5` работает заметно быстрее на NodeJS сервере. При этом, размер итогового бандла на сервере не имеет значения.

### Бандл для браузеров

Современные бандлеры (Webpac, etc.) поддерживают ES модули, и нестандартное поле `"browser"` в `package.json`.
При наличии поля `browser` в `package.json`, `@tramvai/build` генерирует бандл с кодом стандарта `ES2019`, в формате `ES modules`.

Если поле `browser` в `package.json` является строкой, то из этого файла вычисляется точка входа для `browser` бандла, и его новое название.
Например, при `"browser": "lib/browser.js"`, точкой входа будет `src/browser.ts`, а бандл будет называться `lib/browser.js`.

Иначе, если поле `browser` является объектом и сборка произведена через `tramvai-build --forPublish`, название вычисляется из поля `main` в `package.json`, и добавляется суффикс `.browser`, например `lib/index.browser.js`.
Далее в поле `browser` добавится свойство, указывающее сборщикам приложений, какой бандл резолвить для браузерной сборки, вместо поля `module`:

```json
{
  "browser": {
    ...,
    "./index.es.js": "./index.browser.js"
  }
}
```

> Спецификация поля [browser](https://github.com/defunctzombie/package-browser-field-spec)
> Генерируется код стандарта `ES2019`, т.к. ожидается, что этот бандл, из поля `"browser"`, будут резолвить бандлер (Webpac, etc.), для которого уже настроена транспиляция через `babel` пакетов в `node_modules`, написанных на современном JS, в код согласно актуальному browserslist конфигу.

При сборке нашего пакета в приложении через `webpack` с опцией `target: 'web'`, бандл из поля `browser` будет иметь больший приоритет, чем поле `module`.

### Копирование статических файлов

При каждом билде автоматически копируются все файлы, кроме JS/TS скриптов и JSON, например CSS, изображения, шрифты, и сохраняются исходные пути до файлов (`src/css/style.css` -> `lib/css/style.css`).
Копирование можно отключить, собирая пакет с флагом `copyStaticAssets`:

```bash
tramvai-build --copyStaticAssets false
```

### Сборка и копирование миграций

При наличии файлов в папке `migrations`, они считаются исходниками миграций.
Эти файлы компилируются в `.js` и копируются в папку `__migrations__`.

## CLI

### Разовая сборка

```bash
tramvai-build
```

### Сборка в watch режиме

```bash
tramvai-build --watch
```

### Копирование статических файлов

```bash
tramvai-copy
```

### Доступные флаги

```bash
tramvai-build --help
```

## JavaScript API

### TramvaiBuild

`TramvaiBuild` позволяет конфигурировать утилиту для дальнейшего использования.

```ts
import { TramvaiBuild } from '@tramvai/build';

new TramvaiBuild(options);
```

**Доступные опции:**

@inline src/options.h.ts

### Сборка

Метод `TramvaiBuild.start` позволяет собрать пакет, разово или в `watch` режиме, в зависимости от конфигурации экземпляра `TramvaiBuild`:

```ts
import { TramvaiBuild } from '@tramvai/build';

new TramvaiBuild(options).start();
```

### Копирование статических файлов

Метод `TramvaiBuild.copy` позволяет разово копировать статические файлы в `output` директорию:

```ts
import { TramvaiBuild } from '@tramvai/build';

new TramvaiBuild(options).copy();
```

## How to

### Как собрать отдельный бандл для браузерной сборки?

Допустим, у нас есть две точки входа, серверная - `src/server.ts`, и клиентская - `src/browser.ts`.
В таком случае, необходимо настроить поле `browser` в `package.json` таким образом:

```json
{
  "main": "lib/server.js",
  "browser": "lib/browser.js"
}
```

После сборки для публикации мы получим такой `package.json`:

```json
{
  "main": "lib/server.js",
  "browser": "lib/browser.js",
  "typings": "lib/server.d.ts",
  "module": "lib/server.es.js"
}
```

### Как заменить отдельный модуль для браузерной сборки?

Допустим, у нас есть одна точка входа - `src/index.ts`, а модуль `src/external.ts` мы хотим заменить на `src/external.browser.ts`.
В таком случае, необходимо настроить поле `browser` в `package.json` таким образом:

```json
{
  "main": "lib/index.js",
  "browser": {
    "./lib/external.js": "./lib/external.browser.js"
  }
}
```

После сборки для публикации мы получим такой `package.json`:

```json
{
  "main": "lib/index.js",
  "browser": {
    "./lib/external.js": "./lib/external.browser.js",
    "./lib/index.es.js": "./lib/index.browser.js",
  },
  "typings": "lib/index.d.ts",
  "module": "lib/index.es.js"
}
```

### Как собирать все пакеты в монорепе при разработке, в watch режиме?

@TODO + ссылка на `@tinkoff/fix-ts-references`

### Как сделать чтобы модуль импортировался только при определенных условиях, а иначе игнорировался при сборке?

Вместо статичных импортов можно использовать динамический import или require. В этом случае, импортированный модуль будет собран в отдельный чанк и будет добавлен в сборку вебпаком при необходимости, причем при использовании динамического импорта также будет создан отдельный чанк после сборки вебпака, при использовании require отдельного чанка не будет.

```tsx
let func = noop;

if (process.env.NODE_ENV !== 'production') {
  func = require('./realFunc').func;
}

export { func };
```

### Как использовать json файлы в пакете?

По умолчанию в корневом `tsconfig.json` включена опция `resolveJsonModule` которая позволяет импортировать json-файлы также как и обычный код используя `import`, причем всё будет работать с типизацией и tree-shaking при публикации пакета. Для того чтобы ts не ругался на такие импорты необходимо в `tsconfig.json` пакета добавить новое вхождение в поле `includes`:

```json
{
  "includes": ["./src", "./src/**/*.json"]
}
```

### Как использовать файлы других расширений в пакете (например .css)?

Такие файлы не используются в сборке или явно в коде, и ts такие файлы игнорирует. Для правильной работы пакета потребуется дополнительная настройка, а именно прописать в `package.json` пакета скрипт `tramvai-copy`:

```json
{
  "scripts": {
    "copy-static-assets": "tramvai-copy"
  }
}
```

Цель этого скрипта в копировании файлов не относящихся к исходному коду в директорию сборки. Само копирование происходит либо при установке зависимостей в корне репозитория, либо при непосредственной публикации пакетов. Так как в некоторых кейсах по какой-либо причине директория сборки может быть удалена то возможно потребуется перезапуск команды `tramvai-copy` для данных пакетов.

### Как использовать css-модули в пакете?

Для того, чтобы typescript не ругался на импорты css-модулей, в папку `src` внутри пакета нужно добавить файл `typings.d.ts` с определением:

```tsx
declare module '*.css' {
  const value: any;
  export default value;
}
```

Для копирования css во время dev-сборки нужно изменить команду:

```json
"watch": "tramvai-copy && tsc -w"
```

Такие импорты никак не преобразуются, для правильной сборки нужно использовать `@tramvai/cli` или другие решения для css-модулей. При сборке корректность импортов не проверяется, так что проверяйте пакет перед публикацией.
