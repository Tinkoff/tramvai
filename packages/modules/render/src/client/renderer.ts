import { createElement } from 'react';
import { useIsomorphicLayoutEffect } from '@tinkoff/react-hooks';
import type { FC } from 'react';
import type { Renderer } from './types';

const ExecuteRenderCallback: FC<{ callback: () => void }> = ({ children, callback }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useIsomorphicLayoutEffect(callback, []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return children as any;
};

const renderer: Renderer = ({ element, container, callback }) => {
  if (process.env.__TRAMVAI_CONCURRENT_FEATURES) {
    const wrappedElement = createElement(ExecuteRenderCallback, { callback }, element);
    // eslint-disable-next-line import/no-unresolved, import/extensions
    const { hydrateRoot } = require('react-dom/client');
    return hydrateRoot(container, wrappedElement);
  }
  const { hydrate } = require('react-dom');
  return hydrate(element, container, callback);
};

export { renderer };
