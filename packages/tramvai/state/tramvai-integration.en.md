# Интеграция с tramvai

There are three main options for working with application state:

- Change state
- Get the state
- Subscribe to change of state

When working with state in `React` components, `@tramvai/state` provides convenient hooks, which are described in the [React Hooks](features/state/hooks.md) documentation.
But, in `tramvai` applications, this is not enough, since there are additional entities in which work with state occurs - `providers` and `actions`.

## Providers

The module `@tramvai/module-common` connects the `StateModule`, which makes the provider `STORE_TOKEN` available in the application,
which implements all the possibilities of state management:

```tsx
type Store = {
  dispatch(event);
  subscribe(listener);
  subscribe(reducer, listener);
  getState();
  getState(reducer);
}
```

### Change of state

The `store.dispatch()` method is used to change state, for example:

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

### Read state

The `store.getState()` method is used to get the general state, or the state of a particular reducer.

> Using `store.getState(reducer)` is not suitable for optional stores -
> if you are not sure if the store is connected in the application directly or through modules, use `const { storeName = defaultValue } = store.getState()`

Example:

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
      // { user: {} } - get all state
      const state = store.getState();
      // user: {} - get the state of a specific reducer
      const user = store.getState(userReducer);
    };
  },
  deps: {
    store: STORE_TOKEN,
  },
}
```

### Subscription

The `store.subscribe()` method is used to subscribe to a global state change, for example:

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

Or to subscribe to a change in the state of a specific reducer:

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

## Actions

The module `@tramvai/module-common` connects the provider `CONTEXT_TOKEN` in the application, which, in addition to working with state (under the hood, `STORE_TOKEN` is used), allows you to run actions:

```tsx
type ConsumerContext = {
  executeAction(action, payload);
  dispatch(event);
  subscribe(listener);
  getState();
  getState(reducer);
}
```

An example of using context:

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
