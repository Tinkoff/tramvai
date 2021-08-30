# createReducer

Метод `createReducer` создает функции - редьюсеры, которые описывают состояние при инициализации и реакцию на изменение состояния.

Принцип работы и api строится на основе: https://redux.js.org/basics/reducers и интерфейса использования из https://github.com/pauldijou/redux-act#createreducerhandlers-defaultstate

### Описание метода

`createReducer(name, initialState)`

- `name` - уникальное название редьюсера. Не должно пересекаться с другими редьюсерами
- `initialState` - состояние редьюсера по умолчанию

### Типизация

По умолчанию, тип стейта редьюсера, и его название, выводятся автоматически:

```tsx
import { createReducer } from '@tramvai/state';

const userReducer = createReducer('user', { name: 'anonymus' });
```

Зачем вообще нужна типизация для названия редьюсера?
Тогда этот редьюсер будет удобнее использовать вместе с `useSelector`.

Если передавать тип стейта вручную, желательно указать и название вторым аргументом дженерика:

```tsx
import { createReducer } from '@tramvai/state';

type UserState = { name: string };

const userReducer = createReducer<UserState, 'user'>('user', { name: 'anonymus' });
```

Но, можно просто задать нужный тип для `initialState`:

```tsx
import { createReducer } from '@tramvai/state';

type UserState = { name?: string };

const userReducer = createReducer('user', {} as UserState);
```

### Подписка на эвенты

`.on(evnet, reducer)` При создании редьюсера становится доступным метод .on который позволяет подписаться на события и вернуть новый стейт

- `event` - эвент или строка, на которые будет подписан редьюсер
- `reducer(state, payload)` - чистая функция которая принимает текущий `state`, `payload` из события и должен вернуть новое состояние редьюсера

**_Пример использования `.on` метода_**

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

### Автоматическое создание эвентов

`.createEvents(model)` метод который позволяет убрать необходимость в создании и явном привязывании эвентов

- `model` - объект, в котором ключ это идентификатор эвента, который потом будет передан в `createEvent`, а значение это функция редьюсера, которая попадет в метод `.on()` и будет вызываться при срабатывании эвентов

**_Пример использования `.createEvents` метода_**

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

Обязательно необходимо описать типы `payload` аргумента в редьюсерах, иначе не будет работать вывод типов для эвентов.
