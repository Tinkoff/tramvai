import type { FC } from 'react';
import { createElement, useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { Renderer } from './types';

const WARNING_TEXT =
  '\n--->\n-->\n->\nInstall experemental version of React and ReactDOM for blocking and concurrent modes!\n->\n-->\n--->';

const ExecuteRenderCallback: FC<{ callback: () => void }> = ({ children, callback }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return children as any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rendererFactory = (createRoot: any): Renderer => ({ element, container, callback, log }) => {
  if (process.env.NODE_ENV === 'development' && !createRoot) {
    log.error(WARNING_TEXT);
  }

  const wrappedElement = createElement(ExecuteRenderCallback, { callback }, element);

  return createRoot(container, { hydrate: true }).render(wrappedElement);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockingRenderer = rendererFactory((ReactDOM as any).createBlockingRoot);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const concurrentRenderer = rendererFactory((ReactDOM as any).createRoot);

export { blockingRenderer, concurrentRenderer };
