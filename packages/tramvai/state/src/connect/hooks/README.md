# State hooks

## useActions

Позволяет исполнять трамвайные [экшены](concepts/action.md) в React компонентах

### Интерфейс

- `actions` - один или массив трамвайных экшенов

> Если передавать в `useActions` массив, для типизации требуется указать `as const` - `useActions([] as const)`

### Использование

```tsx
import { useActions } from '@tramvai/state';
import { loadUserAction, getInformationAction, setInformationAction } from './actions';

export const Component = () => {
  // если передавать один экшен, тип payload для loadUser выводится автоматически
  const loadUser = useActions(loadUserAction);

  // если передавать список экшенов, `as const` необходим для корректного вывода типов
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

## useSelector()

Получение данных со стора в компонентах

### Интерфейс

- `stores: []` - список токенов на которые будет подписан селектор. Будет влиять на то, какие изменения в сторах вызовут обновление в компоненте
- `selector: (state) => any` - сам селектор, это функция, которая будет вызвана при инициализации и любых изменениях сторов переданных в `stores`. Функция должна вернуть данные которые можно будет использовать в компоненте
- `equalityFn?: (cur, prev) => boolean` - не обязательная функция для изменения способа сравнения прошлых и новых значений селектора

### Использование

Для получения данных из стора, можно использовать имя стора, ссылку на стор, или объект с опциональным стором:

- `'storeName'`
- `storeObject`
- `{ store: storeObject, optional: true }`
- `{ store: 'storeName', optional: true }`

Можно передавать массив ключей, тогда для корректного вывода типов лучше использовать `as const`:

- `useSelector(['fooStoreName', barStoreObject] as const, ({ foo, bar }) => null)`;

```tsx
import { useSelector } from '@tramvai/state';

export const Component = () => {
  const isBrowser = useSelector('media', (state) => state.media.isBrowser);

  return <div>{isBrowser ? <span>Browser</span> : <span>Desktop</span>}</div>;
};
```

### Оптимизации

Для того, чтобы уменьшить количество перерисовок компонентов после каждого вызова `selector` проверяются возвращаемые значения с теми, которые были раньше. Если возвращаемые данные селектора не изменились, то компонент не будет перерисован.

По этой причине, в селекторах лучше получать небольшие куски информации. Тогда меньше шанс, что компонент обновится. К примеру: нам нужны `roles` пользователя, мы пишем селектор, который запрашивает все данные пользователя `(state) => state.user` и теперь любые изменения редьюсера `user` будут обновлять компонент. Лучше, если мы будем получать только необходимые данные `(state) => state.user.roles` в таком случае перерисовываться компонент будет только тогда, когда изменятся `roles` пользователя

## useStoreSelector

Упрощенная версия хука useSelector, в который можно передать только один стор, созданный через createReducer. Сделан был для улучшения вывода типов селекторов, так как сам useSelector не может этого делать из-за использования внутри строковых имен сторов, токенов и наследников BaseStore

### Интерфейс

- `store: Reducer` - Стор, созданный через createReducer
- `selector: (state) => any` - сам селектор, это функция, которая будет вызвана при инициализации и любых изменениях стора, переданного в `stores`. Функция должна вернуть данные которые можно будет использовать в компоненте

### Использование

```tsx
import { useStoreSelector } from '@tramvai/state';
import { createReducer } from '@tramvai/state';

const myStore = createReducer('myStore', { id: '123' });

export const Component = () => {
  const id = useStoreSelector((myStore, (state) => state.id)); // Корректно выведется тип id как "string"

  return <div>{id}</div>;
};
```

### Оптимизации

Хук является оберткой над useSelector, поэтому оптимизации аналогичны. Сама функция селектора внутри мемоизируется

## useStore

Хук для получения состояния конкретного редьюсера.

Особенности:

- автоматически выводит тип состояния
- перерендеривает компонент только при обновлении редьюсера
- позволяет создавать редьюсеры "на лету"

### Интерфейс

- `store: Reducer` - Стор, созданный через createReducer

### Использование

Базовый пример:

```tsx
import { useStore } from '@tramvai/state';
import { createReducer } from '@tramvai/state';

const userReducer = createReducer('user', { id: '123' });

export const Component = () => {
  const { id } = useStore(userReducer);

  return <div>{id}</div>;
};
```
