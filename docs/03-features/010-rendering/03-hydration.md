---
id: hydration
title: Hydration
---

Explanation from [React documentation](https://beta.reactjs.org/reference/react-dom/hydrate#hydrating-server-rendered-html):

> In React, “hydration” is how React “attaches” to existing HTML that was already rendered by React in a server environment. During hydration, React will attempt to attach event listeners to the existing markup and take over rendering the app on the client.

`tramvai` provides full React 18 support and will automatically use [`hydrateRoot` API](https://beta.reactjs.org/reference/react-dom/client/hydrateRoot) at client-side, for older React versions [`hydrate` method](https://beta.reactjs.org/reference/react-dom/hydrate) will be used.

Hydration is not simple process and usually a one [long heavy task](https://web.dev/optimize-long-tasks/), which can significantly delay the [time to interactivity](https://web.dev/i18n/en/tti/) of our application. There is a few optimisations which can improve hydration speed:
- [Selective Hydration](#selective-hydration)
- [Lazy Hydration](#lazy-hydration)

## Selective Hydration

### Explanation

[Selective Hydration](https://www.patterns.dev/posts/react-selective-hydration/) - it is result of new React [Concurrent Features](https://beta.reactjs.org/blog/2022/03/29/react-v18#what-is-concurrent-react), when hydration and rendering tasks splitted in small pieces of work.

### Usage

Selective hydration can be activated by a few options:
- [`Suspense`](https://beta.reactjs.org/reference/react/Suspense) wrapper around some heavy component - concurrent rendering will be used only for this component subtree
- Run `hydrateRoot` inside [`startTransition`](https://beta.reactjs.org/reference/react/startTransition) - concurrent rendering will be used for all application tree

`tramvai` out-of-the-box will wrap `hydrateRoot` in `startTransition`, and selective hydration will be available automatically for all `tramvai` applications with React >= 18 version!

### Drawbacks

Selective hydration is not free:
- full hydration will be delayed because of more async tasks overhead
- if user interacts with page, React will swich to regular heavy hydration for faster response

Because of that, we recommend to wrap all significant blocks of your application in `Suspense`, because of this benefits:
- after user interaction, React will switch to regular hydration **only for this block subtree**
- if this block fails while server rendering, React will render `fallback` and another page content will be rendered as usual (otherwise full page rendering will be failed)

## Lazy Hydration

### Explanation

`tramvai` provides `@tramvai/react-lazy-hydration-render` - it is a small library to improve hydration performance in SSR apps. It is based on a lazy hydration approach.

- **Small** only 650 bytes (minified and gzipped)
- **Improves TTI** do not waste CPU on what the user does not see
- **Customize.** component activation mechanism can be changed

#### More about lazy hydration

- [How it works (discussed in issue at react's github)](https://github.com/facebook/react/issues/10923#issuecomment-338715787)
- [About selective hydration on React Conf 2019](https://www.youtube.com/watch?v=UxoX2faIgDQ&t=3372)
- [react render strategy](https://youtu.be/NythxcOI2Mw?t=2925)

### Installation

```bash npm2yarn
npm install @tramvai/react-lazy-hydration-render
```

This library is using IntersectionObserver API. if you need to support older browsers, you should install [intersection-observer polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) in order for it to work.

### Usage

#### Default mode

Component is activated when user scrolls to it.

```tsx
import React from 'react';
import { LazyRender } from '@tramvai/react-lazy-hydration-render';

const HeavyHeader = () => <header>1</header>;

export const Header = () => (
  <LazyRender>
    <HeavyHeader />
  </LazyRender>
);
```

#### Customize wrapper

You can configure the wrapper component.

```tsx
import React from 'react';
import { LazyRender } from '@tramvai/react-lazy-hydration-render';

const HeavyHeader = () => <header>1</header>;

export const Header = () => (
  <LazyRender wrapper="p" wrapperProps={{ style: { margin: '10px' } }}>
    <HeavyHeader />
  </LazyRender>
);
```

#### Configuring IntersectionObserver

```tsx
import React from 'react';
import { LazyRender, createUseObserverVisible } from '@tramvai/react-lazy-hydration-render';

const useObserverVisible = createUseObserverVisible({
  rootMargin: '0px',
  threshold: 1.0,
});

const HeavyHeader = () => <header>1</header>;

export const Header = () => (
  <LazyRender useObserver={useObserverVisible}>
    <HeavyHeader />
  </LazyRender>
);
```

#### Passing custom observer

Package supports changing a loading mechanics. For example, component could be activated on click.

```tsx
import React, { useEffect, useState } from 'react';
import { LazyRender } from '@tramvai/react-lazy-hydration-render';

const isServer = typeof window === 'undefined';

const useClickActivated = (ref) => {
  const [isVisible, changeVisibility] = useState(isServer);

  useEffect(() => {
    if (!ref.current || isVisible) {
      return;
    }

    ref.current.addEventListener('click', () => changeVisibility(true));
  }, [ref]);

  return isVisible;
};

const HeavyHeader = () => <header>1</header>;

export const Header = () => (
  <LazyRender useObserver={useClickActivated}>
    <HeavyHeader />
  </LazyRender>
);
```

#### Server cache

For maximum rendering performance on server-side, `LazyRender` has ability to cache rendering result (HTML string), and reuse them for subsequent renders.

It is very useful for static blocks, but may not be practical for units with different levels of dynamics.

Example, how to enable server cache:

```tsx
import React from 'react';
// can be any other cache library
import LRU from '@tinkoff/lru-cache-nano';
import { LazyRender } from '@tramvai/react-lazy-hydration-render';

const serverCache = new LRU({ max: 20, ttl: 60000 });

const HeavyHeader = () => <header>1</header>;

export const Header = () => (
  <LazyRender
    cacheEnabled={true}
    cacheKey="header"
    serverCache={serverCache}
  >
    <HeavyHeader />
  </LazyRender>
);
```

##### Cache keys

If you have a limited set of dynamic options with low cardinality, just use them in `cacheKey` property:

```tsx
export const Header = ({ isMobile }) => {
  const cacheKey = isMobile ? "header:mobile" : "header:desktop";

  return (
    <LazyRender
      cacheEnabled={true}
      cacheKey={cacheKey}
      serverCache={serverCache}
    >
      <HeavyHeader
        isMobile={isMobile}
      />
    </LazyRender>
  );
};
```
