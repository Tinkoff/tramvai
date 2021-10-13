# Интеграция @tramvai/cli с browserslist

[browserslist](https://github.com/browserslist/browserslist) позволяет указывать целевые браузеры, для которых происходит сборка и тем самым выполнять минимум преобразований, только там где это нужно.

Где используется browserslist:

- При сборке js/ts кода - через [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)
- При сборке css, при использовании postcss-плагина [autoprefixer](https://github.com/postcss/autoprefixer)

## Виды env для browserslist

В cli используется определённый список возможных env target для работы с browserslist:

- `modern` - используется для сборки клиентского кода для современных браузеров
- `node` - используется при сборке серверного кода
- `defaults` - используется в остальных случаях, т.е. для сборки клиентского кода для устаревших браузеров

## Настройка в cli

По умолчанию в cli используются определения из библиотеки `@tinkoff/browserslist-config`.

Чтобы расширить или переопределить настройки по умолчанию можно использовать любой из способов [задания конфига browserslist](https://github.com/browserslist/browserslist#queries) следуя правилам:

- Менять конфигурацию можно для [env из списка, используемого в cli](#виды-env-для-browserslist) - [как задавать](https://github.com/browserslist/browserslist#configuring-for-different-environments). Если какого-то env в конфиге не будет, то будет использован конфиг по умолчанию.
- Если необходимо расширить списки по умолчанию, то используйте [возможность расширения конфига](https://github.com/browserslist/browserslist#shareable-configs)
  ```json
  "browserslist": {
    "modern": [
      "extends @tinkoff/browserslist-config",
      "chrome > 25"
    ],
    "node": [
      "extends @tinkoff/browserslist-config"
    ],
    "defaults": [
      "extends @tinkoff/browserslist-config",
      "chrome > 27"
    ]
  }
  ```
- В случае если необходимо сузить список браузеров, то откажитесь от использования `extends @tinkoff/browserslist-config` и пропишите список всех браузеров самостоятельно, ориентируясь на список в `@tinkoff/browserslist-config`. При необходимости сделайте это для всех [env](#виды-env-для-browserslist) - те env которые не будут переопределены будут работать по умолчанию

## Дебаг

Чтобы проверить работу browserslist можно выполнить следующие команды из корня приложения:

```sh
npx browserslist --env=modern # покажет список браузеров для modern
npx browserslist --env=node # покажет список поддерживаемых версий nodejs
npx browserslist # покажет список браузеров вместе с legacy браузерами
```

## Нюансы

### autoprefixer

Из-за особенностей устройства самого `autoprefixer` при сборке будет использован только `defaults` конфиг. Если есть серьёзная заинтересованность в раздельной компиляции css, то напишите, пожалуйста, об этом в slack-чате #tramvai
