# Tramvai test mocks

Library for creating mocks for various tramvai entities

## Подключение

```bash
npm i --save-dev @tramvai/test-mocks
```

## Api

### STORE_TOKEN

Creates mock instance for token STORE_TOKEN which used in app as a common storage for store

#### Empty State

```ts
import { createMockStore } from '@tramvai/test-mocks';

const store = createMockStore();
const state = store.getState();

store.dispatch('event');
```

#### Initial State

Pass required stores, initial state will be applied automatically:

```ts
import { createMockStore } from '@tramvai/test-mocks';

const reducer = createReducer('test', 'value');

const store = createMockStore({ stores: [reducer] });

const state = store.getState(); // { test: 'value' }
```

Or pass just initialState, fake reducers will be created under the hood:

```ts
import { createMockStore } from '@tramvai/test-mocks';

const initialState = { a: 1, b: 2 };

const store = createMockStore({ initialState });

const state = store.getState(); // { a: 1, b: 2 }
```

Also you can change initial state of passed reducer:

```ts
import { createMockStore } from '@tramvai/test-mocks';

const initialState = { test: 'modified' };
const reducer = createReducer('test', 'default');

const store = createMockStore({ stores: [reducer], initialState });

const state = store.getState(); // { test: 'modified' }
```

<p>
<details>
<summary>More examples</summary>

@inline src/store.spec.ts

</details>
</p>

### DI

Creates mock instance of DI-container

```ts
import { createMockDi } from '@tramvai/test-mocks';

const di = createMockDi();

const dep = di.get(SOME_TOKEN);
```

### Context

Creates mock instance for CONTEXT_TOKEN

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

<p>
<details>
<summary>More examples</summary>

@inline src/context.spec.ts

</details>
</p>

### Router

Creates mock instance for `@tinkoff/router`

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
