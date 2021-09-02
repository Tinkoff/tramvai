# prettier-config-tinkoff
Prettier конфигурация проекта

## Установка
Устанавливаем через package manager
```bash
npm i --save-dev prettier-config-tinkoff
```

## Подключение
Создаем файл в корне проекта `.prettierrc.js` в котором
```js
module.exports = require("prettier-config-tinkoff")
```
То есть, в этом случае мы просто подключаем конфигурацию из нашего модуля и при необходимости можем изменить.

Подробнее про это в [документации prettier](https://prettier.io/docs/en/configuration.html#sharing-configurations)
