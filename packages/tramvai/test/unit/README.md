# Tramvai test unit

Helpers library for writing tramvai specific unit-tests

It might be even more useful when used with [`@tramvai/test-mocks`](./mocks.md)

## Installation

```bash
npm i --save-dev @tramvai/test-unit
```

## How to

### Testing reducers

```ts
import { testReducer } from '@tramvai/test-unit';

it('test', async () => {
  const { dispatch, getState } = testReducer(reducer);

  expect(getState()).toEqual([]);

  dispatch(event(1));

  expect(getState()).toEqual([1]);
});
```

<p>
<details>
<summary>More examples</summary>

@inline src/state/testReducer.spec.ts

</details>
</p>

### Testing actions

Tramvai context and DI will be created automatically, otherwise you can directly pass it as an argument.

```ts
import { testAction } from '@tramvai/test-unit';

it('test', async () => {
  const { run, context } = testAction(action, { initialState: { a: 1 } });

  expect(await run(true)).toBe('hello');
  expect(await run(false)).toBe('world');

  context.getState(); // { a: 1 }
});
```

<p>
<details>
<summary>More examples</summary>

@inline src/state/testAction.spec.ts

</details>
</p>

### Testing tramvai module

#### Testing module in isolation

```ts
import { testModule } from '@tramvai/test-unit';

it('test', async () => {
  const { di, module, runLine } = testModule(TestModule);

  expect(module).toBeInstanceOf(TestModule);
  expect(di.get('testToken')).toEqual({ a: 1 });

  // Run only specific command line in order to execute handlers for this line inside module
  await runLine(commandLineListTokens.generatePage);
});
```

#### Testing module in conjunction with other modules

```ts
import { createTestApp } from '@tramvai/test-unit';

it('test', async () => {
  const { app } = await createTestApp({ modules: [TestModule, DependentModule] });

  // get tokens from di implemented by module
  expect(app.di.get('testToken')).toEqual({ a: 1 });
});
```

<p>
<details>
<summary>More examples</summary>

@inline src/module/testModule.spec.ts

</details>
</p>

### Adding providers to DI

Most of the helpers accepts option `providers` which allows to redefine already existing providers or add new.

For example, passing `providers` to helper `testAction` allows to access this provider inside action itself:

```tsx
import { declareAction } from '@tramvai/core';
import { testAction } from '@tramvai/test-unit';

const action = declareAction({
  name: 'action',
  fn() {
    console.log(this.deps.test); // token value
  },
  deps: {
    test: 'token name',
  },
});

it('test', async () => {
  const { run } = testAction(action, {
    providers: [
      {
        provide: 'token name',
        useValue: 'token value',
      },
    ],
  });
});
```

### Create app only for testing

```ts
import { createTestApp } from '@tramvai/test-unit';

it('test', async () => {
  const { app } = await createTestApp({ modules: [TestModule, DependentModule] });

  // get tokens from di implemented by module
  expect(app.di.get('testToken')).toEqual({ a: 1 });
});
```

<p>
<details>
<summary>More examples</summary>

@inline src/app/createTestApp.spec.ts

</details>
</p>
