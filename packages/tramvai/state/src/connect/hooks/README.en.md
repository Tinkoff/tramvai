# State hooks

## useActions

Allows to execute tram [actions](concepts/action.md) in React components

### Interface

- `actions` - one or an array of tram actions

> If you pass an array to `useActions`, for typing you need to specify `as const` - `useActions([] as const)`

### Usage

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

## useSelector ()

Receiving data from the store in components

### Interface

- `stores: []` - a list of tokens that the selector will subscribe to. Will affect which store changes will trigger an update in the component
- `selector: (state) => any` - the selector itself, this is a function that will be called upon initialization and any changes to the stores passed to `stores`. The function should return data that can be used in the component
- `equalityFn?: (cur, prev) => boolean` - optional function to change the way of comparing past and new values ​​of a selector

### Usage

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

### Optimizations

In order to reduce the number of component redrawings, after each call to `selector`, the return values ​​are checked against those that were before. If the returned selector data has not changed, then the component will not be redrawn.

For this reason, it is better to get small chunks of information in selectors. Then there is less chance that the component will be updated. For example: we need the user's `roles`, we write a selector that requests all user data `(state) => state.user` and now any changes to the `user` reducer will update the component. It is better if we receive only the necessary data `(state) => state.user.roles`, in which case the component will be redrawn only when the user's `roles` change

## useStoreSelector

A simplified version of the useSelector hook into which only one store can be passed, created via createReducer. It was made to improve the inference of selector types, since useSelector itself cannot do this due to the use of strings, tokens and BaseStore heirs inside string names

### Interface

- `store: Reducer` - Store created through createReducer
- `selector: (state) => any` - the selector itself, this is a function that will be called upon initialization and any changes to the store passed to `stores`. The function should return data that can be used in the component

### Usage

```tsx
import { useStoreSelector } from '@tramvai/state';
import { createReducer } from '@tramvai/state';

const myStore = createReducer('myStore', { id: '123' });

export const Component = () => {
  const id = useStoreSelector((myStore, (state) => state.id)); // The id type will be correctly inferred as "string"

  return <div>{id}</div>;
};
```

### Optimizations

The hook is a wrapper over useSelector, so the optimizations are the same. The selector function itself is memoized inside

## useStore

Hook to get the state of a specific reducer.

Peculiarities:

- automatically displays the type of state
- re-renders the component only when the reducer is updated
- allows you to create reducers "on the fly"

### Interface

- `store: Reducer` - Store created by createReducer

### Usage

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
