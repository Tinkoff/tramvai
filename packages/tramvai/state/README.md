# State

**State** is a library built into `tramvai` for managing application state.

## Peculiarities

- Redux-like state manager
- Built-in library similar to [redux-act](https://github.com/pauldijou/redux-act) to reduce boilerplate code
- Contains bindings to `react` components such as `connect` and `useSelector`
- Dynamic initialization of reducers. You can register a reducer at any time or generate a new one.
- Point subscriptions to changes in the states of reducers. When data changes, only the affected `connect` and `useSelector` are recalculated, not everything.
- Support for SSR mode.

## Basic concepts

- Store - A class that contains the state of all reducers, change subscriptions and is created for each client
- Reducers - entities in which we describe how data will be stored and transformed
- Events - events with which you can change the states of reducers
- Actions - functions that allow you to perform side effects and update data in the store. Similar to `redux-thunk`

## Recommendations

- You cannot mutate data in reducers. Otherwise, due to various optimizations, subscribers will not be notified about the changes.
- Initialize reducers as early as possible and before using it. Otherwise, when calling `dispatch(userLoadInformation())`, the reducer will not yet track events and will not receive data.
- Do not store static data in stores. Since this data will be transferred from the server to the client, the data will be duplicated. Better to put in constants.
- Break into small reducers. Otherwise, we have a huge reducer that contains a large amount of information and any changes will cause recalculations for a large number of components.

## Installation

```bash
npm i --save @tramvai/state
```

## Explanation

### schedule

Some of the functions that deals with state (e.g. connect, useStoreSelector) will use some sort of batching (using requestAnimationFrame or SetTimeout) in browser. So any updates to state are not synchronous and happens after some time.

Most of the time this is not an issue or noticeable thing. But in tests that might be unexpected.

> In order to take into account scheduling while testing use [waitRaf helper](references/test/test-jsdom.md#waitraf) or [act from test-unit](references/test/test-unit.md#act)

## How to

### Basic example

```tsx
import { createReducer, createEvent } from '@tramvai/state';

export const userLoadInformation = createEvent('user load information');
export const userAddInformation = createEvent('user add information');

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
