# Интеграция с tramvai

Для работы с состоянием приложения есть три основные возможности:

- Изменить состояние
- Получить состояние
- Подписаться на изменение состояния

При работе с состоянием в `React` компонентах, `@tramvai/state` предоставляет удобные хуки, которые описаны в доке [Хуки для React](features/state/hooks.md).
Но, в `tramvai` приложениях этого недостаточно, так как есть дополнительные сущности, в которых происходит работа с состоянием - `провайдеры` и `экшены`.

## Провайдеры

Модуль `@tramvai/module-common` подключает `StateModule`, который делает доступным в приложении провайдер `STORE_TOKEN`,
реализующий все возможности управления стейтом:

```tsx
type Store = {
  dispatch(event);
  subscribe(listener);
  subscribe(reducer, listener);
  getState();
  getState(reducer);
}
```

### Изменение состояния

Метод `store.dispatch()` используется для изменения состояния, например:

```tsx
import { commandLineListTokens } from '@tramvai/core';
import { createEvent, createReducer } from '@tramvai/state';
import { STORE_TOKEN } from '@tramvai/tokens-common';

const incEvent = createEvent('inc');
const countReducer = createReducer('count', 0).on(inc, (state) => state + 1);

const provider = {
  provide: commandLineListTokens.resolveUserDeps,
  multi: true,
  useFactory: ({ store }) => {
    return function updateCountReducer() {
      store.dispatch(incEvent());
    };
  },
  deps: {
    store: STORE_TOKEN,
  },
}
```

### Чтение состояния

Метод `store.getState()` используется для получения общего состояния, или состояния конкретного редьюсера.

> Использование `store.getState(reducer)` не подходит для опциональных сторов -
> если вы не уверены, что стор подключается в приложении напрямую или через модули, используйте `const { storeName = defaultValue } = store.getState()`

Пример:

```tsx
import { commandLineListTokens } from '@tramvai/core';
import { createEvent, createReducer } from '@tramvai/state';
import { STORE_TOKEN } from '@tramvai/tokens-common';

const userReducer = createReducer('user', {});

const provider = {
  provide: commandLineListTokens.resolveUserDeps,
  multi: true,
  useFactory: ({ store }) => {
    return function readUserState() {
      // { user: {} } - получаем все состояние
      const state = store.getState();
      // user: {} - получаем состояние конкретного редьюсера
      const user = store.getState(userReducer);
    };
  },
  deps: {
    store: STORE_TOKEN,
  },
}
```

### Подписка

Метод `store.subscribe()` используется для подписки на изменение глобального состояния, например:

```tsx
import { commandLineListTokens } from '@tramvai/core';
import { createEvent, createReducer } from '@tramvai/state';
import { STORE_TOKEN } from '@tramvai/tokens-common';

const incEvent = createEvent('inc');
const countReducer = createReducer('count', 0).on(inc, (state) => state + 1);

const provider = {
  provide: commandLineListTokens.resolveUserDeps,
  multi: true,
  useFactory: ({ store }) => {
    return function listenCountState() {
      let currentState = store.getState(countReducer);

      const unsubscribe = store.subscribe((nextGlobalState) => {
        const nextState = store.getState(countReducer);

        if (currentState !== nextState) {
          console.log('count reducer state is:', currentState);
          currentState = nextState;
        }
      });

      setInterval(() => {
        store.dispatch(incEvent());
      }, 1000);
    };
  },
  deps: {
    store: STORE_TOKEN,
  },
}
```

Или для подписки на изменение состояния конкретного редьюсера:

```tsx
import { commandLineListTokens } from '@tramvai/core';
import { createEvent, createReducer } from '@tramvai/state';
import { STORE_TOKEN } from '@tramvai/tokens-common';

const incEvent = createEvent('inc');
const countReducer = createReducer('count', 0).on(inc, (state) => state + 1);

const provider = {
  provide: commandLineListTokens.resolveUserDeps,
  multi: true,
  useFactory: ({ store }) => {
    return function listenCountState() {
      const unsubscribe = store.subscribe(countReducer, (nextState) => {
        console.log('count reducer state is:', nextState);
      });

      setInterval(() => {
        store.dispatch(incEvent());
      }, 1000);
    };
  },
  deps: {
    store: STORE_TOKEN,
  },
}
```

## Экшены

Модуль `@tramvai/module-common` подключает в приложении провайдер `CONTEXT_TOKEN`, которые помимо работы с состоянием (под капотом используется `STORE_TOKEN`), позволяет запускать экшены:

```tsx
type ConsumerContext = {
  executeAction(action, payload);
  dispatch(event);
  subscribe(listener);
  getState();
  getState(reducer);
}
```

Пример использования контекста:

```tsx
import { createAction } from '@tramvai/core';
import { createEvent, createReducer } from '@tramvai/state';

const loadUser = createEvent('load user');
const userReducer = createReducer('user', { name: 'anonymus' });

userReducer.on(loadUser, (state, payload) => payload);

const fetchUserAction = createAction({
  name: 'fetchUser',
  fn: async (context, payload, { httpClient }) => {
    
    const { name } = context.getState(userReducer);
    
    if (name !== 'anonymus') {
      return;
    }
    
    const response = await httpClient.get('/user');
    
    context.dispatch(loadUser(response.payload));
  },
  deps: {
    httpClient: HTTP_CLIENT,
  },
});
```
