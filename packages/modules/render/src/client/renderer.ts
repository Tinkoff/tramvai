import debounce from '@tinkoff/utils/function/debounce';
import type React from 'react';
import { createElement } from 'react';
import { useIsomorphicLayoutEffect } from '@tinkoff/react-hooks';
import type { FC } from 'react';
import type { Renderer } from './types';

const reactMinifiedErrorRegex = /Minified React error #(\d+);/;
const shortenErrorStackTrace = (stackTrace: string) =>
  stackTrace.split('\n').slice(0, 15).join('\n');

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
          const match = (error?.message ?? '').match(reactMinifiedErrorRegex);
          const key = match?.[1] ?? error?.message;

          // deduplicate by error type - too much noise otherwise
          if (!allErrors.has(key)) {
            // also too long stack traces are not very helpful but heavy for log collection
            if (typeof errorInfo?.componentStack === 'string') {
              // eslint-disable-next-line no-param-reassign
              errorInfo.componentStack = shortenErrorStackTrace(errorInfo.componentStack);
            }
            allErrors.set(key, { error, errorInfo });
          }

          logHydrateRecoverableError();
        },
      });
    });
  }
  const { hydrate } = require('react-dom');
  return hydrate(element, container, callback);
};

export { renderer };
