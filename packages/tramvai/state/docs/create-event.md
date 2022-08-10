# createEvent

The `createEvent` method creates an event that can be subscribed to in state management

## Method Description

`createEvent(eventName: string, payloadCreator?: PayloadTransformer): EventCreator`

- `eventName` - Unique identifier of the event
- `payloadCreator` - an optional function that allows you to combine multiple arguments into one, In cases where the event was called with multiple arguments.

## Examples

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

We create an action in which, after loading the information, we create an event and throw it into context.dispatch

```javascript
import { declareAction } from '@tramvai/core';
import { createEvent } from '@tramvai/state';

const userInformation = createEvent < { age: number, name: string } > 'user information';

const action = declareAction({
  name: 'userLoadInformation',
  async fn() {
    const result = await tinkoffRequest({ method: 'information' });
    this.dispatch(userInformation(result));
  },
});
```
