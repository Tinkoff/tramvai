---
id: ui-component
title: UI component
---

## Explanation

Child App has a root React component, which is rendered in Root Application wherever you will use `<ChildApp name={yourChildAppName} />` component. This component specified in `render` property of `createChildApp` function:

```ts
import { createChildApp } from '@tramvai/child-app-core';
import { RootCmp } from './components/root';

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'fancy-child',
  render: RootCmp,
  providers: [],
});
```

This `RootCmp` is usual React component, and you can make it as complex and nested as you want.

## Component props

:::info

Better way to get some data from Root App is to [pass it through DI](03-features/015-child-app/09-di.md), because it is more flexible and allows you to get data from any place in Child App, not only in UI component.

But for simple Child App UI updates from Root Application this approach is acceptable.

:::

Child App can receive props from Root App. You can pass props to Child App in `<ChildApp />` component in `props` property:

```tsx
// Root App page

const Page = () => {
  const counter = useStore(CounterStore);
  // always memoize props to avoid unnecessary re-renders and hydration problems
  const props = useMemo(() => ({ counter }), [counter]);

  return (
    <ChildApp name="fancy-child" props={props} />
  );
}
```

And you will receive this props in root Child App component, also in `props` property:

```tsx title="components/root.tsx"
export const RootCmp = ({ props }) => {
  const { counter } = props;

  return <div>Counter from Root App: {counter}</div>;
};
```

## Component fallback

`fallback` - React Component that will be rendered while Child App is loading (by default is null) or there was an error inside Child App (by default is a standard Error Boundary component)

```tsx
// Root App page

const FallbackCmp = ({ error }: { error?: Error }) => {
  if (error) {
    return <div>Error fallback</div>;
  }
  return <div>Loading fallback</div>;
};

const Page = () => {
  const counter = useStore(CounterStore);

  return (
    <ChildApp name="fancy-child" fallback={FallbackCmp} />
  );
}
```
