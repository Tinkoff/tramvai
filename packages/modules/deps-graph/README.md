# DepsGraphModule

> Работает только в development режиме и показывает граф только для серверной сборки

Модуль для построения графа зависимостей токенов.

## Установка

### 1. Зависимости

Необходимо установить `@tramvai/module-deps-graph` с помощью npm/yarn

```bash
npm i @tramvai/module-deps-graph
```

### 2. Подключение модуля

Нужно передать в список модулей приложения CommonModule

```tsx
import { createApp } from '@tramvai/core';
import { DepsGraphModule } from '@tramvai/module-deps-graph';

createApp({
  modules: [DepsGraphModule],
});
```

## Использование

Добавляет папи роут `/deps-graph` (можно найти по адресу /:appName/papi/deps-graph, где appName - поле name из tramvai.json), по которому выводится граф всех зависимостей с возможностью поиска по токену и имени модуля

Также модуль интегрирован в [tramvai dev-tools](references/modules/devTools.md), рекомендуется использовать его оттуда.

#### Описание графа

- Синий - обычный провайдер
- Желтый - mutli-провайдер
- Красный - подпавший под поиск

![img.png](http://s.csssr.ru/UAHCBP6MS/localhost_3000_pfphome_papi_deps-graph_search%3Dboxy%26lines%3Dgenerate_page%252Cinit_-_Google_Chrome_2021-04-13_14.55.05.png)
