# Tramvai test unit

Библиотека хелперов для написания юнит-тестов для приложений на tramvai

## Подключение

```bash
npm i --save-dev @tramvai/test-unit
```

## How to

### Тестирование reducers

```ts
import { testReducer } from '@tramvai/test-unit';

it('test', async () => {
  const { dispatch, getState } = testReducer(reducer);

  expect(getState()).toEqual([]);

  dispatch(event(1));

  expect(getState()).toEqual([1]);
});
```

### Тестирование экшенов

```ts
import { testAction } from '@tramvai/test-unit';

it('test', async () => {
  const { run } = testAction(action);

  expect(await run(true)).toBe('hello');
  expect(await run(false)).toBe('world');
});
```

### Тестирование tramvai-модуля

#### Тестирование модуля в изоляции

```ts
import { testModule } from '@tramvai/test-unit';

it('test', async () => {
  const { di, module, runLine } = testModule(TestModule);

  expect(module).toBeInstanceOf(TestModule);
  expect(di.get('testToken')).toEqual({ a: 1 });

  await runLine(commandLineListTokens.generatePage);
});
```

#### Тестирования модуля в связке с другими модулями

```ts
import { createTestApp } from '@tramvai/test-unit';

it('test', async () => {
  const { app } = await createTestApp({ modules: [TestModule, DependentModule] });

  expect(app.di.get('testToken')).toEqual({ a: 1 });
});
```

### Тестирование приложения

```ts
import { testApp } from '@tramvai/test-unit';

it('test', async () => {
  const { request, render } = await testApp(app);

  const response = await request('/').expect(200).expect('X-App-Id', 'unit-app');

  expect(response.text).toMatch('<html class="no-js" lang="ru">');
  expect(response.text).toMatch('<div class="application">rootPage</div>');
  expect(response.text).toMatch('<script>var initialState =');

  const rootPage = await render('/');

  expect(rootPage.application).toEqual('rootPage');

  const secondPage = await render('/second/');

  expect(secondPage.application).toEqual('secondPage');
  expect(secondPage.initialState).toEqual({
    stores: expect.objectContaining({
      environment: {
        FRONT_LOG_API: 'test',
      },
      router: expect.objectContaining({
        currentUrl: expect.objectContaining({
          path: '\\u002Fsecond\\u002F',
        }),
      }),
    }),
  });
});
```
#### Добавление провайдеров в DI

Опции большинства утилит поддерживают свойство `providers`,
которое позволяет перезаписать существующие провайдеры, или добавить новые.

Например, передав провайдер в `testAction`, к нему можно будет обратиться внутри самого экшена:

```tsx
import { createAction } from '@tramvai/core';
import { testAction } from '@tramvai/test-unit';

const action = createAction({
  name: 'action',
  fn: (_, __, { test }) => {
    console.log(test); // token value
  },
  deps: {
    test: 'token name'
  }
})

it('test', async () => {
  const { run } = testAction(action, {
    providers: [{
      provide: 'token name',
      useValue: 'token value'
    }]
  });
});
```
