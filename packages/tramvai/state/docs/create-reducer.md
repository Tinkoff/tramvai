# createReducer

The `createReducer` method creates reducer functions that describe the state during initialization and the reaction to state changes.

The working principle and api is built based on: https://redux.js.org/basics/reducers and the use interface from https://github.com/pauldijou/redux-act#createreducerhandlers-defaultstate

### Method Description

`createReducer(name, initialState)`

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

### Subscription to events

`.on(evnet, reducer)` When creating a reducer, the .on method becomes available, which allows you to subscribe to events and return a new state

- `event` - an event or a string to which the reducer will be subscribed
- `reducer(state, payload)` - a pure function that takes the current `state`, `payload` from the event and must return the new state of the reducer

**_An example of using the `.on` method_**

```javascript
import { createReducer, createEvent } from '@tramvai/state';

export const userLoadInformation = createEvent < { status: string } > 'user load information';
export const userAddInformation = createEvent < { name: string, info: {} } > 'user add information';

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

**_An example of using the `.createEvents` method_**

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
