# React lazy hydration render

Small library to improve hydration performance in SSR apps. It is based on a lazy hydration approach.

- **Small** only 650 bytes (minified and gzipped)
- **Improves TTI** do not waste CPU on what the user does not see
- **Customize.** component activation mechanism can be changed

## More about lazy hydration

- [How it works (discussed in issue at react's github)](https://github.com/facebook/react/issues/10923#issuecomment-338715787)
- [About selective hydration on React Conf 2019](https://www.youtube.com/watch?v=UxoX2faIgDQ&t=3372)
- [react render strategy](https://youtu.be/NythxcOI2Mw?t=2925)

## Install

```bash
npm i --save @tramvai/react-lazy-hydration-render
```

or

```bash
yarn add @tramvai/react-lazy-hydration-render
```

This library is using IntersectionObserver API. if you need to support older browsers, you should install [intersection-observer polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) in order for it to work.

## Usage

### Default mode

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

### Customize wrapper

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

## Configuring IntersectionObserver

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

### Passing custom observer

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
