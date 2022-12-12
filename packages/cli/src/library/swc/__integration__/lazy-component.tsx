import { lazy } from '@tramvai/react';

const LazyComponent = lazy(() => import('./components/lazy-inner'));

export const Component = () => {
  return (
    <>
      <h2>Lazy test</h2>
      <LazyComponent />
    </>
  );
};
