import type { RefObject } from 'react';

export const createUseObserverVisible =
  (observerOptions: IntersectionObserverInit) => (containerRef: RefObject<HTMLElement>) => {
    return true;
  };
