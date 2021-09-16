# Polyfills

В tramvai есть интеграции подгрузки полифилов:

- существует отдельная библиотека `@tinkoff/pack-polyfills` которая содержит все необходимые полифилы
- `@tramvai/cli` умеет собирать полифилы как отдельный файл
- `@tramvai/module-render` содержит код, который подгружает полифилы только там, где они нужны

## Настройка

#### Устанавливаем пак полифилов

```bash
npm i --save @tinkoff/pack-polyfills
```

#### Создаем файл polyfill.ts

Необходимо создать файл `polyfill.ts` внутри вашего проекта, к примеру `src/polyfill.ts` и подключить полифилы:

```tsx
import '@tinkoff/pack-polyfills';
```

#### Настраиваем @tramvai/cli

После этого необходимо сказать `@tramvai/cli` о том, что в нашем проекте есть полифилы. Для этого в `tramvai.json` добавляем для нашего проекта строку `"polyfill": "src/polyfill.ts"` в `projects[APP_ID].commands.build.options.polyfill` пример:

```
{
  "projects": {
    "pfphome": {
      "name": "pfphome",
      "root": "src",
      "type": "application",
      "commands": {
        "build": {
          "options": {
            "server": "src/index.ts",
            "vendor": "src/vendor.ts",
            "polyfill": "src/polyfill.ts"
          }
        }
      }
    }
  }
}

```

## Как работает загрузка полифилов

На стороне `@tramvai/cli` настроена сборка полифилов в отдельный файл, что бы не смешивать с основным кодом. И при каждой сборке у нас будет появляться файл с полифилами.

[module-render](references/modules/render.md) если находит в сборке полифилы, то для каждого клиента встраивает inline код, который проверяет доступность фич в браузере и если браузер не поддерживает какую либо из фич, то тогда мы считаем браузер устаревшим и грузим полифилы. Пример проверки: `!window.Promise.prototype.finally || !window.URL || !window.URLSearchParams || !window.AbortController`

## Замена проверки загрузки полифилов

### Зачем это может понабиться?

Если вам не подходит стандартная проверка на поддерживаемые фичи в браузере и полифилы не грузятся в браузерах где должны. То в таком случае лучше написать в канал #tramvai и мы обновим проверку, либо можете заменить проверку на иную.

### Необходимо учитывать

- `POLYFILL_CONDITION` должен вернуть true, если не поддерживает браузер какие-либо фичи
- Не стоит грузить полифилы всем браузерам
- лучше расширять `DEFAULT_POLYFILL_CONDITION` дополнительными проверками, а не заменять

## Замена проверки

Для этого нужно задать провайдер `POLYFILL_CONDITION`, который находится в `import { POLYFILL_CONDITION } from '@tramvai/module-render'` и передать новую строку.

Пример: Это синтетический пример, но допустим мы хотим дополнительно проверять на присутствие window.Promise в браузере, для этого расширяем `DEFAULT_POLYFILL_CONDITION` строку. Итоговое выражение должно вернуть true, если не поддерживает браузерами фича

```tsx
import { POLYFILL_CONDITION, DEFAULT_POLYFILL_CONDITION } from '@tramvai/module-render';
import { provide } from '@tramvai/core';

const provider = provide({
  provide: POLYFILL_CONDITION,
  useValue: `${DEFAULT_POLYFILL_CONDITION} || !window.Promise`,
});
```
