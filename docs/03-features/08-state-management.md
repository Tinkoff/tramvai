---
id: state-management
title: State Management
---

`@tramvai/state` is a library built into `tramvai` for managing application state.

## Features

- Redux-like state manager
- Built-in library similar to [redux-act](https://github.com/pauldijou/redux-act) to reduce boilerplate code
- Contains bindings to `React` components such as `useStore` and `useSelector`
- Dynamic initialization of reducers. You can register a reducer at any time or generate a new one
- Point subscriptions to changes in the states of reducers. When data changes, only the affected `useStore` and `useSelector` are recalculated, not everything
- Full SSR support

## Concepts

- [Store](#store) - A class that contains the state of all reducers, change subscriptions and is created for each client
- [Context](#context) - wrapper for the Store which extends Store API and add additional functionality for [actions](concepts/action.md) support
- [Reducers](#reducer) - entities in which we describe how data will be stored and transformed
- [Events](#event) - events with which you can change the states of reducers
- [Actions](concepts/action.md) - functions that allow you to perform side effects and update data in the store. Similar to `redux-thunk`. Actions is a separate mechanism and is not related directly to `@tramvai/state`

## Recommendations

- Create unique names for reducers, otherwise conflicted reducers will be overwritten by last registered
- You mustn't mutate data in reducers. Otherwise, due to various optimizations, subscribers will not be notified about the changes
- Initialize reducers as early as possible and before using it. Otherwise, when calling `dispatch(userLoadInformation())`, the reducer will not yet track events and will not receive data
- Do not store static data in stores. Since this data will be transferred from the server to the client, the data will be duplicated. Better to put in constants
- Break into small reducers. Otherwise, we have a huge reducer that contains a large amount of information and any changes will cause recalculations for a large number of components
- Use [Actions](concepts/action.md) to perform side effects and handle complex state changing logic

## Quick Start

:hourglass: Create new reducer:

```tsx
import { createReducer, createEvent } from '@tramvai/state';

export const increment = createEvent('increment');
export const decrement = createEvent('decrement');

export const CounterStore = createReducer('counter', 0)
  .on(increment, (state, payload) => state + 1)
  .on(decrement, (state, payload) => state - 1);
```

:hourglass: Register reducer in application (global registration, for all pages):

```tsx title="index.ts"
import { provide } from '@tramvai/core';
import { COMBINE_REDUCERS } from '@tramvai/tokens-common';

createApp({
  providers: [
    provide({
      provide: COMBINE_REDUCERS,
      useValue: CounterStore,
    }),
  ],
});
```

:hourglass: Read and update reducer in component:

```tsx
import { useStore } from '@tramvai/state';
import { useDi } from '@tramvai/react';
import { STORE_TOKEN } from '@tramvai/tokens-common';

export const Component = () => {
  // get Store instance from DI
  const store = useDi(STORE_TOKEN);
  // subscribe to counter reducer state
  const counter = useStore(CounterStore);

  // bind events to dispatch
  const handleIncrement = () => store.dispatch(increment());
  const handleDecrement = () => store.dispatch(decrement());

  return (
    <>
      <h1>Count is: {counter}</h1>
      <button onClick={handleIncrement}>increment</button>
      <button onClick={handleDecrement}>decrement</button>
    </>
  );
};
```

## Store

Store instance is created for each client request and is available in the DI container by the token `STORE_TOKEN`.

### Interface

```ts
type Store = {
  dispatch(event);
  subscribe(listener);
  subscribe(reducer, listener);
  getState();
  getState(reducer);
};
```

### Usage

`STORE_TOKEN` can be used in [providers](concepts/provider.md), [actions](concepts/action.md) and components.

For example, we can work with Store in [commandLineRunner stages](03-features/06-app-lifecycle.md):

```ts
import { commandLineListTokens } from '@tramvai/core';
import { createEvent, createReducer } from '@tramvai/state';
import { STORE_TOKEN } from '@tramvai/tokens-common';

const provider = {
  provide: commandLineListTokens.resolveUserDeps,
  useFactory: ({ store }) => {
    return function readCounterState() {
      const counter = store.getState(CounterStore);
    };
  },
  deps: {
    store: STORE_TOKEN,
  },
};
```

#### `getState()`

`store.getState()` method is used to get the global state, or the state of a particular reducer.

If you want to get the state of all reducers, use `getState` without arguments:

```ts
const state = store.getState(); // { counter: 0 }
```

Otherwise pass specific reducer to `getState`:

```ts
const counter = store.getState(CounterStore); // 0
```

#### `dispatch()`

`store.dispatch()` method is used to change state through events (only subscribed to event reducers will be updated):

```ts
store.dispatch(increment());
const counter = store.getState(CounterStore); // 1
```

#### `subscribe()`

`store.subscribe()` method is used to subscribe to a global state change.

If you want to subscribe for all reducers updates, use `subscribe` with one callback argument:

```ts
let currentState = store.getState().counter;

const unsubscribe = store.subscribe((nextGlobalState) => {
  const nextState = nextGlobalState.counter;

  if (currentState !== nextState) {
    console.log('counter is changed:', currentState);
    currentState = nextState;
  }
});
```

Otherwise pass specific reducer as first argument to `subscribe`, and callback as second:

```ts
let currentState = store.getState(CounterStore);

const unsubscribe = store.subscribe(CounterStore, (nextState) => {
  console.log('counter is changed:', currentState);
  currentState = nextState;
});
```

## Reducer

The `createReducer` method creates reducer functions that describe the state during initialization and the reaction to state changes.

The working principle and api is built based on [Redux reducers](https://redux.js.org/basics/reducers) and the use interface from [redux-act](https://github.com/pauldijou/redux-act#createreducerhandlers-defaultstate)

### Interface

`createReducer(name, initialState): Reducer`

- `name` - unique name of the reducer. Should not overlap with other reducers
- `initialState` - default reducer state

### Typing

By default, the reducer state type and name are displayed automatically:

```tsx
import { createReducer } from '@tramvai/state';

const userReducer = createReducer('user', { name: 'anonymus' });
```

Why do we need typing for the name of the reducer at all?
Then this reducer will be more convenient to use together with `useSelector`.

If you pass the state type manually, it is desirable to specify the name as the second argument of the generic:

```tsx
import { createReducer } from '@tramvai/state';

type UserState = { name: string };

const userReducer = createReducer<UserState, 'user'>('user', { name: 'anonymus' });
```

But, you can simply set the desired type for `initialState`:

```tsx
import { createReducer } from '@tramvai/state';

type UserState = { name?: string };

const userReducer = createReducer('user', {} as UserState);
```

### Events subscription

`.on(event, reducer)` When creating a reducer, the .on method becomes available, which allows you to subscribe to events and return a new state.

- `event` - an event or a string to which the reducer will be subscribed
- `reducer(state, payload)` - a pure function that takes the current `state`, `payload` from the event and must return the new state of the reducer

Example of using the `.on` method:

```javascript
import { createReducer, createEvent } from '@tramvai/state';

export const userLoadInformation = createEvent<{ status: string }> 'user load information';
export const userAddInformation = createEvent<{ name: string, info: {} }> 'user add information';

const userReducer = createReducer('user', {
  info: {},
})
  .on(userLoadInformation, (state, info) => ({ info }))
  .on(userAddInformation, (state, { name, info }) => ({
    ...state,
    state: {
      ...state.info,
      [name]: info,
    },
  }));
```

### Automatic creation of events

`.createEvents(model)` method that removes the need to create and explicitly bind events

- `model` - an object in which the key is the event identifier, which will then be passed to `createEvent`, and the value is the reducer function, which will get into the `.on()` method and will be called when the events are triggered

Example of using the `.createEvents` method:

```tsx
import { createReducer } from '@tramvai/state';

const userReducer = createReducer('user', {
  info: {},
});

export const { userLoadInformation, userAddInformation } = userReducer.createEvents({
  userLoadInformation: (state, info: { status: string }) => ({ info }),
  userAddInformation: (state, { name, info }: { name: string; info: {} }) => ({
    ...state,
    state: {
      ...state.info,
      [name]: info,
    },
  }),
});
```

It is imperative to describe the types of the `payload` argument in reducers, otherwise type inference for events will not work.

### Connecting reducers to the app

For global store registration, for all pages, you can provide `COMBINE_REDUCERS`:

```tsx title="index.ts"
import { provide } from '@tramvai/core';
import { COMBINE_REDUCERS } from '@tramvai/tokens-common';

createApp({
  providers: [
    provide({
      provide: COMBINE_REDUCERS,
      useValue: CounterStore,
    }),
  ],
});
```

If you need reducer only for a specific page, you can pass it in the [Page](03-features/03-pages.md#reducers) or [Nested Layout](03-features/04-layouts.md#reducers), in `reducers` static property.

## Event

The `createEvent` method creates an event that can be subscribed to in state management

### Interface

`createEvent(eventName: string, payloadCreator?: PayloadTransformer): EventCreator`

- `eventName` - Unique identifier of the event
- `payloadCreator` - an optional function that allows you to combine multiple arguments into one, In cases where the event was called with multiple arguments.

### Usage

#### Creating an event without parameters

```tsx
import { createEvent } from '@tramvai/state';

const userLoadingInformation = createEvent('user loading information');

userLoadingInformation();
```

#### Creating an event with parameters

```tsx
import { createEvent } from '@tramvai/state';

const userInformation = createEvent<{ age: number; name: string }>('user information');

userInformation({ age: 42, name: 'Tom' });
```

#### Create event with payload conversion

```tsx
import { createEvent } from '@tramvai/state';

const itemPrice = createEvent('user information', (info: string, price: number) => ({
  [info]: price,
}));

itemPrice('car', 3000);
```

#### Using Events in Actions

In this example we will create an action in which, after loading the information, we create an event and pass it into `context.dispatch`:

```javascript
import { declareAction } from '@tramvai/core';
import { createEvent } from '@tramvai/state';

const userInformation = createEvent < { age: number, name: string } > 'user information';

const action = declareAction({
  name: 'userLoadInformation',
  async fn() {
    const result = await fetch('api/user/information');
    this.dispatch(userInformation(result));
  },
});
```

## Context

`ConsumerContext` instance is created for each client request and is available in the DI container by the token `CONTEXT_TOKEN`.

### Interface

```tsx
type ConsumerContext = {
  executeAction(action, payload);
  dispatch(event);
  subscribe(listener);
  subscribe(reducer, listener);
  getState();
  getState(reducer);
};
```

### Usage

`CONTEXT_TOKEN` can be used in [providers](concepts/provider.md) and components.

:::tip

We recommend to prefer `STORE_TOKEN` if you don't need to run actions, for consistency in the codebase

:::

#### In providers

For example, we can working with Context in [commandLineRunner](03-features/06-app-lifecycle.md) stages:

```ts
import { commandLineListTokens } from '@tramvai/core';
import { createEvent, createReducer } from '@tramvai/state';
import { CONTEXT_TOKEN } from '@tramvai/tokens-common';

const provider = {
  provide: commandLineListTokens.resolveUserDeps,
  useFactory: ({ context }) => {
    return function readCounterState() {
      const counter = context.getState(CounterStore);
    };
  },
  deps: {
    context: CONTEXT_TOKEN,
  },
};
```

#### In actions

Context methods will be available in action `fn` property as `this` context:

```tsx
import { declareAction } from '@tramvai/core';
import { createEvent, createReducer } from '@tramvai/state';

const loadUser = createEvent('load user');
const userReducer = createReducer('user', { name: 'anonymus' });

userReducer.on(loadUser, (state, payload) => payload);

const fetchUserAction = declareAction({
  name: 'fetchUser',
  async fn() {
    // highlight-next-line
    const { name } = this.getState(userReducer);

    if (name !== 'anonymus') {
      return;
    }

    const response = await this.deps.httpClient.get('/user');

    // highlight-next-line
    this.dispatch(loadUser(response.payload));
  },
  deps: {
    httpClient: HTTP_CLIENT,
  },
});
```

#### In components

You can use [useConsumerContext](#useconsumercontext) React Hook to get the current context from DI.

## React Hooks

### `useStore()`

Hook to get the state of a specific reducer.

Features:

- automatically displays the type of state
- re-renders the component only when the reducer is updated
- allows you to create reducers "on the fly"

#### Interface

`useStore(store: Reducer)`

- `store` - store created by createReducer

#### Usage

Basic example:

```tsx
import { useStore } from '@tramvai/state';
import { createReducer } from '@tramvai/state';

const userReducer = createReducer('user', { id: '123' });

export const Component = () => {
  const { id } = useStore(userReducer);

  return <div>{id}</div>;
};
```

### `useSelector()`

Receiving data from the store in components

#### Interface

`useSelector(stores: [], selector: (state) => any, equalityFn?: (cur, prev) => boolean)`

- `stores` - a list of tokens that the selector will subscribe to. Will affect which store changes will trigger an update in the component
- `selector` - the selector itself, this is a function that will be called upon initialization and any changes to the stores passed to `stores`. The function should return data that can be used in the component
- `equalityFn` - optional function to change the way of comparing past and new values ​​of a selector

#### Usage

To get data from a store, you can use a store name, a reference to a store, or an object with an optional store:

- `'storeName'`
- `storeObject`
- `{ store: storeObject, optional: true }`
- `{ store: 'storeName', optional: true }`

You can pass an array of keys, then for correct type inference it is better to use `as const`:

- `useSelector(['fooStoreName', barStoreObject] as const, ({ foo, bar }) => null)`;

```tsx
import { useSelector } from '@tramvai/state';

export const Component = () => {
  const isBrowser = useSelector('media', (state) => state.media.isBrowser);

  return <div>{isBrowser ? <span>Browser</span> : <span>Desktop</span>}</div>;
};
```

#### Optimizations

In order to reduce the number of component redrawings, after each call to `selector`, the return values ​​are checked against those that were before. If the returned selector data has not changed, then the component will not be redrawn.

For this reason, it is better to get small chunks of information in selectors. Then there is less chance that the component will be updated. For example: we need the user's `roles`, we write a selector that requests all user data `(state) => state.user` and now any changes to the `user` reducer will update the component. It is better if we receive only the necessary data `(state) => state.user.roles`, in which case the component will be redrawn only when the user's `roles` change

### `useStoreSelector()`

A simplified version of the useSelector hook into which only one store can be passed, created via createReducer. It was made to improve the inference of selector types, since useSelector itself cannot do this due to the use of strings, tokens and BaseStore heirs inside string names

#### Interface

`useStoreSelector(store: Reducer, selector: (state) => any)`

- `store` - Store created through createReducer
- `selector` - the selector itself, this is a function that will be called upon initialization and any changes to the store passed to `stores`. The function should return data that can be used in the component

#### Usage

```tsx
import { useStoreSelector } from '@tramvai/state';
import { createReducer } from '@tramvai/state';

const myStore = createReducer('myStore', { id: '123' });

export const Component = () => {
  const id = useStoreSelector((myStore, (state) => state.id)); // The id type will be correctly inferred as "string"

  return <div>{id}</div>;
};
```

#### Optimizations

The hook is a wrapper over useSelector, so the optimizations are the same. The selector function itself is memoized inside

### `useActions()`

Allows to execute tramvai [actions](concepts/action.md) in React components

#### Interface

`useActions(actions: Action): Function`
`useActions(actions: Action[]): Function[]`

- `actions` - one or an array of tramvai actions

> If you pass an array to `useActions`, for typing you need to specify `as const` - `useActions([] as const)`

#### Usage

```tsx
import { useActions } from '@tramvai/state';
import { loadUserAction, getInformationAction, setInformationAction } from './actions';

export const Component = () => {
  // if you pass one action, the payload type for loadUser is automatically deduced
  const loadUser = useActions(loadUserAction);

  // if you pass a list of actions, `as const` is required for correct type inference
  const [getInformation, setInformation] = useActions([
    getInformationAction,
    setInformationAction,
  ] as const);

  return (
    <div>
      <div onClick={loadUser}>load user</div>
      <div onClick={getInformation}>get information</div>
      <div onClick={() => setInformation({ user: 1 })}>set information</div>
    </div>
  );
};
```

### `useConsumerContext()`

:::tip

Prefer [useActions](#useactions) hook if you need to execute actions only

:::

#### Interface

`useConsumerContext(): ConsumerContext` - will return [ConsumerContext](#context)

#### Usage

```tsx
import { useConsumerContext } from '@tramvai/state';

export const Component = () => {
  const context = useConsumerContext();

  useEffect(() => {
    context.executeAction(anyTramvaiAction, payloadForThisAction);
  }, []);

  return null;
};
```

### `connect`

`connect` is deprecated for couple of reasons:
- `connect` forces you to use decorators, which will have to be significantly changed in the future
- increases bundle size for 2-3 kb gzip
- unsafe with React concurrent features at the risk of [stale props](https://kaihao.dev/posts/Stale-props-and-zombie-children-in-Redux)
- [React hooks](#react-hooks) are better, faster and safer way to subsribe to the store

## DevTools

To enable Redux DevTools, you need to run:

- Install browser extension: [Chrome extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) or [FireFox extension](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)
- Open the page on `tramvai` and open the extension by clicking on the Redux devtools icon

![Redux devtools](https://cloud.githubusercontent.com/assets/7957859/18002950/aacb82fc-6b93-11e6-9ae9-609862c18302.png)

### Possible problems

1. For a better user experience, you need to use a separate redux dev tools extension window, not a tab in chrome developer tools, because otherwise the action history is not saved, see [issue](https://github.com/zalmoxisus/redux-devtools-extension/issues/505).

### Performance

Since the entire state of the application with all the actions is quite large, there are noticeable lags when working with devtools when using jumps over states/events and when a large number of actions are triggered simultaneously. That's why:

1. Use customization techniques to set pickState to reduce the size of data in devtools.
1. Increase the value of the latency parameter (passed to connectViaExtension.connect), which essentially debounces sending actions to the extension, see [docs](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#latency)

### Additional links

- [Devtools repository](https://github.com/zalmoxisus/redux-devtools-extension)
- [Getting Started with Redux DevTools Extension ](https://egghead.io/lessons/javascript-getting-started-with-redux-dev-tools)


## Testing

You can find examples how to test reducers or mock store in our complete [Testing Guide](guides/testing.md)!

##### - [Next: Actions](03-features/09-data-fetching/01-action.md)
