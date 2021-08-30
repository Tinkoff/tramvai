# Tramvai mock

`@tramvai/mock` - набор моков некоторых tramvai компонентов.

## Подключение

```bash
npm i --save-dev @tramvai/mock
```

## Context

Для мокирования контекста, используемого в React компонентах и экшенах, можно использовать утилиту `createMockContext`

### Интерфейс

```tsx
type createMockContext = ({ initialState, di, providers, stores, actionConditionals }) => { context, store }
```

- `initialState` - объект с изначальным состоянием стейта
- `di` - экземпляр DI контейнера
- `providers` - список провайдеров, которые будут добавлены в DI. Используется когда нужно замокировать deps
- `stores` - список сторов, созданных через `createReducer`
- `actionConditionals` - список с реализациями глобальных ограничений. Используется когда нужно проверить у экшенов различные ограничения
- `mocks` - моки, в которые будут обернуты `store.dispatch` и `context.executeAction`

- `context` - контекст, который можно использовать при запуске экшенов или передавать в React
- `store` - экземпляр общего стора, с методами `getState`, `dispatch` и `subscribe`

### Тестирование

```tsx
const someEvent = createEvent('someEvent');
const someAction = createAction({
  name: 'someAction',
  fn() {},
});

const { store, context } = createMockContext({
  mocks: {
    dispatchMock: jest.fn,
    executeActionMock: jest.fn,
  },
});

store.dispatch(someEvent());
context.executeAction(someAction);

expect(store.dispatch).toHaveBeenCalled();
expect(context.executeAction).toHaveBeenCalled();
```
