# Tramvai test React

Set of helpers for testing React-components

Helpers are based on libraries [@testing-library/react](https://github.com/testing-library/react-testing-library)

If you are using jest for testing, consider to add a library [@testing-library/jest-dom](https://github.com/testing-library/jest-dom)

> `react` should be installed manually

## Installation

```bash
npm i --save-dev @tramvai/test-react
```

## Explanation

### act

Based on the React [act test helper](https://reactjs.org/docs/test-utils.html#act) that is used to perform rerender component after start changes.

Put you actions that will update React state inside `act` function in order to check result render in the next code.

:::warning

Current wrapper should be awaited in tests to execute some additional internal steps

:::

## How to

### Test component

Under the hood the [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro) is used.

```ts
/**
 * @jest-environment jsdom
 */
import { testComponent } from '@tramvai/test-react';

describe('test', () => {
  it('render', async () => {
    const { render, rerender, context, act, fireEvent, Wrapper } = testComponent(<Cmp id={1} />);

    // test component render
    expect(render.getByTestId('test').textContent).toBe('Content 1');

    // test render after store update
    act(() => {
      context.dispatch(event('data'));
    });

    // interact with the component
    fireEvent.click(render.getByText('Button'));

    // component rerender
    rerender(<Cmp id={2} />);

    expect(render.getByTestId('test').textContent).toBe('Content 2');
  });
});
```

<p>
<details>
<summary>More examples</summary>

@inline src/testComponent.spec.tsx

</details>
</p>

### Test React-hooks

Under the hood the [@testing-library/react](https://github.com/testing-library/react-testing-library) is used.

```ts
/**
 * @jest-environment jsdom
 */
import { testHook } from '@tramvai/test-react';

describe('test', () => {
  it('hook', async () => {
    const { result, context, act } = testHook(() => useHook());

    // test the result of hook call
    expect(result.current).toBe('result');

    // test the result after store update
    act(() => {
      context.dispatch(event('data'));
    });
  });
});
```

<p>
<details>
<summary>More examples</summary>

@inline src/testHook.spec.tsx

</details>
</p>

## Troubleshooting

### Warning: ReactDOM.render is no longer supported in React 18

`@tramvai/test-react` comes with support for react 16 and 17 so if you are using react@18 it will lead to the above warning as this backward-compatibility forces to use legacy render methods.

You can manually specify not to use legacy rendering mode by settings option [`legacyRoot`](https://testing-library.com/docs/react-testing-library/api#legacyroot) to `false`

```ts
/**
 * @jest-environment jsdom
 */
import { testComponent } from '@tramvai/test-react';

describe('test', () => {
  it('component', async () => {
    const { render } = testComponent(<Cmp id={1} />, { legacyRoot: false });
  });
});
```
