import type { middleware as realMiddleware } from './middleware';

/*
### TODO

Монорепозиторий экосистемы [redux-devtools](https://github.com/reduxjs/redux-devtools)

Пример кастомной [интеграции redux-devtools с mobx](https://github.com/zalmoxisus/mobx-remotedev/blob/master/src/monitorActions.js)

Интегрированный в DevTools функционал:

1. Лог экшенов
2. Состояние стейта
3. Dispatch
4. ~~Time Traveling~~
 */

// eslint-disable-next-line import/no-mutable-exports
let middleware: typeof realMiddleware = () => () => (next) => (event) => next(event);

if (process.env.NODE_ENV !== 'production') {
  middleware = require('./middleware').middleware;
}

export { middleware };
