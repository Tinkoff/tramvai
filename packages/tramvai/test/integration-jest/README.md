# Tramvai test integration jest

Пресет для работы с интеграционными тестами в jest

> Для работы должен быть установлены отдельно `@tramvai/cli` и `puppeteer`

## Подключение

```bash
npm i --save-dev @tramvai/test-integration-jest
```

## How To

### Дебаг и разработка интеграционных тестов в Jest

Используя наш пресет для jest можно запускать в watch режиме интеграционные тесты, при этом само приложение запустится только один раз и будет работать в фоне.

1. Добавляем в `jest.integration.config.js` пресет `@tramvai/test-integration-jest`

   ```js
   module.exports = {
     preset: '@tramvai/test-integration-jest',
   };
   ```

2. Добавляем в `package.json` отдельный скрипт для запуска в watch-режиме:

   ```json
   {
     "scripts": {
       "test:integration": "jest -w=3 --config ./jest.integration.config.js",
       "test:integration:watch": "jest --runInBand --watch --config ./jest.integration.config.js"
     }
   }
   ```

3. Запускаем интересующий тест через `yarn test:integration:watch <path_to_test>`. При этом можно будет зайти на стандартный урл `http://localhost:3000` и посмотреть приложение во время работы.

### Окружение для запуска Jest

Минимальный набор зависимостей для запуска `jest`:

```bash
npm i --save-dev jest @types/jest jest-circus
```
