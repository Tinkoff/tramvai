# createEvent

Метод `createEvent` создает событие, на которое можно будет подписаться в state management

## Описание метода

`createEvent(eventName: string, payloadCreator?: PayloadTransformer): EventCreator`

- `eventName` - Уникальные индетификатор события
- `payloadCreator` - не обязательная функция, которая позволяет объединять множество аргументов в один, В случаях, когда эвент был вызван с множеством аргументов.

## Примеры

#### Создание эвента без параметров

```tsx
import { createEvent } from '@tramvai/state';

const userLoadingInformation = createEvent('user loading information');

userLoadingInformation();
```

#### Создание эвента с параметрами

```tsx
import { createEvent } from '@tramvai/state';

const userInformation = createEvent<{ age: number; name: string }>('user information');

userInformation({ age: 42, name: 'Tom' });
```

#### Создание эвента с преобразование payload

```tsx
import { createEvent } from '@tramvai/state';

const itemPrice = createEvent('user information', (info: string, price: number) => ({
  [info]: price,
}));

itemPrice('car', 3000);
```

#### Использование эвентов в экшенах

Мы создаем экшен, в котором после загрузки информации, создаем эвент и кидаем его в context.dispatch

```javascript
import { createAction } from '@tramvai/core';
import { createEvent } from '@tramvai/state';

const userInformation = createEvent < { age: number, name: string } > 'user information';

const action = createAction({
  name: 'userLoadInformation',
  fn: async (context) => {
    const result = await tinkoffRequest({ method: 'information' });
    context.dispatch(userInformation(result));
  },
});
```
