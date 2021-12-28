# DocsRating

Компонент обратной связи для docusaurus. Отправляет данные в Google Analytics

## Установка

`npm install @tramvai/docsRating`

## Использование

Пример подключения можно посмотреть в [документации tramvai](https://github.com/Tinkoff/tramvai/-/blob/master/tools/docSite/src/theme/DocItem/index.js)

Для получения возможности внесения изменений в компоненты docusaurus нужно воспользоваться командой [swizzle](https://v2.docusaurus.io/docs/cli#docusaurus-swizzle)

`docusaurus swizzle DocItem`

после чего можно будет добавлять компонент в любое понравившееся место

```js
import { DocsRating } from '@tramvai/docsRating';

...

<DocsRating label={unversionedId} />
```

### Параметры

- label - [eventLabel](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference?hl=ru#eventLabel), который будет отправлен в google analytics.

## Google Analytics

При лайках\дизлайках генерирует события вида

```
hitType: 'event',
eventCategory: 'feedback',
eventLabel: label, // label из пропсов
eventValue: value, // число: 0 если дизлайк, 1 если лайк
```

Если был оставлен дизлайк, предлагает ввести комментарий с предложениями по улучшению страницы. Комментарии отправляются дополнительными событием вида

```
hitType: 'event',
eventCategory: 'reply',
eventLabel: label, // label из пропсов
eventAction: value, // комментарий, максимальная длина - 400 символов
```

### Просмотр событий

События можно посмотреть в разделе Поведение - События - Обзор в админке Google Analytics.
