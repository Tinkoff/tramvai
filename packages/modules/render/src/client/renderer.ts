import debounce from '@tinkoff/utils/function/debounce';
import type React from 'react';
import { createElement } from 'react';
import { useIsomorphicLayoutEffect } from '@tinkoff/react-hooks';
import type { FC } from 'react';
import type { Renderer } from './types';

let hydrateRoot;
let startTransition;

try {
  // eslint-disable-next-line import/no-unresolved, import/extensions
  hydrateRoot = require('react-dom/client').hydrateRoot;
  startTransition = require('react').startTransition;
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
    let allErrors = new Map();

    const logHydrateRecoverableError = debounce(50, () => {
      if (allErrors.size === 0) {
        return;
      }

      const [{ error, errorInfo }, ...otherErrors] = Array.from(allErrors.values());
      allErrors = new Map();

      log.error({
        event: 'hydrate:recover-after-error',
        error,
        errorInfo,
        otherErrors,
      });
    });

    return startTransition(() => {
      hydrateRoot(container, wrappedElement, {
        onRecoverableError: (error, errorInfo) => {
          // deduplicate by unique important string values
          allErrors.set(error?.message + errorInfo?.componentStack, { error, errorInfo });
          logHydrateRecoverableError();
        },
      });
    });
  }
  const { hydrate } = require('react-dom');
  return hydrate(element, container, callback);
};

export { renderer };
