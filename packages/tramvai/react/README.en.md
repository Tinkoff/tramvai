# React

`@tramvai/react` - library for integrating tramvai features with `React` components

## Install

```bash
npm i --save @tramvai/react
```

## DI

When creating components, you may need to get data from di, for this there is a hook `useDi` and HoC `withDi`

### useDi

```tsx
type useDi = (deps: Record<string, string | Token>) => Record<string, any>;
```

```tsx
type useDi = (dep: string | Token) => any;
```

A hook into which we can pass both an object with the required dependencies and an object with data will be returned to us, as well as a single token, where the result will be returned to us. When we call `useDi`, we get data from di and if we don't find data in di, an error will occur.

```javascript
import React from 'react';
import { useDi } from '@tramvai/react';

const MyComponent = () => {
  const { logger } = useDi({ logger: 'logger' }); // pass the object
  const Region = useDi(regionToken); // pass a single token

  logger.info('text');

  return (
    <div>
      Component
      <Region />
    </div>
  );
};
```

### withDi

```tsx
type withDi = (
  deps: Record<string, string | Token>
) => (wrapper: React.ReactElement<any>) => React.ReactElement<any>;
```

A HoC that allows you to wrap any components, get data from `DI` and pass the result with dependencies to the props of the component

```javascript
import React from 'react';
import { withDi } from '@tramvai/react';

@withDi({ logger: LOGGER_TOKEN })
class BoxyPage extends Component {
  render() {
    this.props.logger.info('text');
    return <div>Component</div>;
  }
}
```

### useDiContainer

```tsx
type useDiContainer = () => DI.Container;
```

Getting an instance of a DI container that has been added to the application context.

It is better not to use this hook, as it is very low-level and is intended for developing new hooks

## Error

To handle errors during rendering, React uses [Error Boundary](https://ru.reactjs.org/docs/error-boundaries.html#introducing-error-boundaries). This package provides its own version of Error Boundary which will log an error through a generic logger and display a stub for the wrapped component if an error occurs.

### ErrorBoundary

Error Boundary component that monitors errors down the tree and, in case of a render error, will log an error and display the `fallbackComponent` component (passed as a props, by default it is a FallbackError from this package) instead of the fallen render subtree.

You can override the `fallbackComponent` through the `ERROR_BOUNDARY_FALLBACK_COMPONENT_TOKEN` provider.

### FallbackError

Component used by default as a stub for a subtree in which a render error occurred

### withError

Hook wrapping component in ErrorBoundary.

## lazy

To dynamically import components with SSR support, there is a high order `lazy` component:

```tsx
import { lazy } from '@tramvai/react';

const LazyComponent = lazy(() => import('./components/foo'), {
  loading: <div>Загрузка...</div>,
});

<LazyComponent />;
```
