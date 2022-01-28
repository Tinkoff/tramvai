# Tramvai test child-app

Helpers library for writing unit tests for tramvai child-app

Uses [`@tramvai/test-unit`](./test-unit.md) under hood to create test root-app that will wrap child-app.

## How to

### Test child-app main component render

You can get React Component returned by child-app from return value of `testChildApp` function and use for example `testComponent` helper from the [`@tramvai/test-react`](./test-react.md)

:::warning

To properly render child-app component pass as props to it its di and optionally props object, that will be passed to the underlying child-app component.

:::

```ts
import { testComponent } from '@tramvai/test-react';
import childApp from './child-app.tsx';

(async () => {
  const {
    childApp: { Component, di },
    close,
  } = await testChildApp(childApp);
  const { render } = testComponent(<Component di={di} props={{ test: 'abc' }} />);

  expect(render.getByTestId('from-root').textContent).toBe('Value from Root: abc');
})();
```

### Test child-app di

```ts
import childApp from './child-app.tsx';

(async () => {
  const {
    childApp: { di },
    close,
  } = await testChildApp(childApp);

  expect(di.get(CHILD_APP_BASE_TOKEN)).toBe("I'm little child app");
})();
```

<p>
<details>
<summary>More examples</summary>

@inline src/testChildApp.spec.tsx

</details>
</p>
