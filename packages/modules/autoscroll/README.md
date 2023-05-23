# Autoscroll

React component that implements autoscroll to page start or to the anchor on page on SPA-navigations

The behaviour is similar to the [react-router](https://reacttraining.com/react-router/web/guides/scroll-restoration/scroll-to-tops)

## Installation

First install `@tramvai/module-autoscroll`:

```bash npm2yarn
yarn add @tramvai/module-autoscroll
```

And add `AutoscrollModule` to the modules list:

```tsx
import { createApp } from '@tramvai/core';
import { AutoscrollModule } from '@tramvai/module-autoscroll';

createApp({
  name: 'tincoin',
  modules: [AutoscrollModule],
});
```

## Explanation

### Behavior

`behavior: smooth` is not supported by every browser (e.g. doesn't work in Safari). In this case you can use polyfill `smoothscroll-polyfill` that you should add to your app.

## How to

### Disable autoscroll for page

If you need to disable autoscroll on the specific pages you can specify parameter `navigateState.disableAutoscroll = true` to the `navigate` call:

```tsx
import { useNavigate } from '@tramvai/module-router';

function Component() {
  const navigateToWithoutScroll = useNavigate({
    url: '/url/',
    navigateState: { disableAutoscroll: true },
  });

  return <Button onClick={navigateToWithoutScroll} />;
}
```

### Scroll behavior change

#### Global

```tsx
import { AUTOSCROLL_BEHAVIOR_MODE_TOKEN } from '@tramvai/module-autoscroll';
import { provide } from '@tramvai/core';

const providers = [
  // ...,
  provide({
    provide: AUTOSCROLL_BEHAVIOR_MODE_TOKEN,
    useValue: 'auto', // default is 'smooth'
  }),
];
```

#### Local

```tsx
import { useNavigate } from '@tramvai/module-router';

function Component() {
  const navigateToWithAutoBehavior = useNavigate({
    url: '/url/',
    navigateState: { autoscrollBehavior: 'auto' },
  });

  return <Button onClick={navigateToWithAutoBehavior} />;
}
```
