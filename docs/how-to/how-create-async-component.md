---
id: how-create-async-component
title: How to split a component into an asynchronous chunk?
---

tramvai supports splitting components into asynchronous chunks with rendering on the server and hydration on the client, using [`@tramvai/react`](features/react.md#lazy)

## Component example

Let's say we have a heavy React component that we use occasionally and we want to load it only when needed.
Right now we have the following code:

```tsx
// file heavy.tsx
export const Heavy = () => <div>123</div>;
```

```tsx
// file page.tsx
import Heavy from './heavy.tsx';

const Page = () => (
  <>
    <Heavy />
    <Footer />
  </>
);
```

## Connecting the lazy

There are several ways to split the component into asynchronous chunks

- Add new wrapper for `heavy` into `page.tsx`.
- Put `heavy` code into a separate file and leave only async wrapper in `heavy.tsx`.

We'll create a new file, as this allows us not to change imports in files that have already used the `Heavy` component. And it will be harder to forget to reuse the async component in the future:

```tsx
// file heavy-component.tsx
export const Heavy = () => <div>123</div>;
```

```tsx
// file heavy.tsx
import { lazy } from '@tramvai/react';

export const Heavy = lazy(() => import('./heavy-component'));
```

```tsx
// file page.tsx
import Heavy from './heavy.tsx';

const Page = () => (
  <>
    <Heavy />
    <Footer />
  </>
);
```

We created a new file, put all the code of the `Heavy` component there, and left only the component itself in the old file, which we wrapped in `lazy` and imported the original component with `import`. Now instead of the original `Heavy` component we will have an asynchronous version which we will load only when rendering the `Page` component.

## Result

The `Heavy` component will be loaded by demand

Next, the component will be:

- Automatically put in a separate webpack chunk
- When rendering, SSR will automatically download the file and immediately render it on the server
- JS and CSS of the chunk will be inserted into the HTML with maximum priority
- It will work seamlessly in the browser

[Example of work in a test application](how-to/ssr-async-components.md)
