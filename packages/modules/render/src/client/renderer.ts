import type React from 'react';
import { createElement } from 'react';
import { useIsomorphicLayoutEffect } from '@tinkoff/react-hooks';
import type { FC } from 'react';
import type { Renderer } from './types';

let hydrateRoot;

try {
  // eslint-disable-next-line import/no-unresolved, import/extensions
  hydrateRoot = require('react-dom/client').hydrateRoot;
} catch {}

const ExecuteRenderCallback: FC<{ callback: () => void; children?: React.ReactNode }> = ({
  children,
  callback,
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useIsomorphicLayoutEffect(callback, []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return children as any;
};

const renderer: Renderer = ({ element, container, callback, log }) => {
  if (process.env.__TRAMVAI_CONCURRENT_FEATURES && typeof hydrateRoot === 'function') {
    const wrappedElement = createElement(ExecuteRenderCallback, { callback }, element);

    return hydrateRoot(container, wrappedElement, {
      onRecoverableError: (error, errorInfo) => {
        log.error({
          event: 'hydrate:recover-after-error',
          error,
          errorInfo,
        });
      },
    });
  }
  const { hydrate } = require('react-dom');
  return hydrate(element, container, callback);
};

export { renderer };
