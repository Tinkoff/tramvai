# Tramvai test mocks

Библиотека для создания моков для различных tramvai-сущностей

## Подключение

```bash
npm i --save-dev @tramvai/test-mocks
```

## Api

### STORE_TOKEN

Позволяет создать мок для токена STORE_TOKEN который используется в приложениях как общее хранилище всех сторов

```ts
import { createMockStore } from '@tramvai/test-mocks';

const store = createMockStore();
const state = store.getState();

store.dispatch('event');
```

### DI

Позволяет создать инстанс Di-Container

```ts
import { createMockDi } from '@tramvai/test-mocks';

const di = createMockDi();

const dep = di.get(SOME_TOKEN);
```

### Context

Позволяет создать инстанс CONTEXT_TOKEN

```ts
import { createMockContext } from '@tramvai/test-mocks';

it('test', async () => {
  const context = createMockContext();

  await context.dispatch('event');
  await context.executeAction(action);

  const spyExecuteAction = jest.spyOn(context, 'executeAction');

  expect(spyExecuteAction).toHaveBeenCalled();
});
```

### Router

Предоставляет мок для инстанса `@tinkoff/router`

```ts
import { createMockRouter } from '@tramvai/test-mocks';

describe('test', () => {
  it('should create router mock', () => {
    const router = createMockRouter();

    expect(router.getCurrentRoute()).toMatchObject({ path: '/' });
    expect(router.getCurrentUrl()).toMatchObject({ path: '/' });
  });

  it('should allow to specify currentRoute', () => {
    const router = createMockRouter({ currentRoute: { name: 'page', path: '/page/test/' } });

    expect(router.getCurrentRoute()).toMatchObject({ path: '/page/test/' });
    expect(router.getCurrentUrl()).toMatchObject({ path: '/page/test/' });
  });
});
```
