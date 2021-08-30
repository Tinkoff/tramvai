import each from '@tinkoff/utils/array/each';
import type { EXTEND_RENDER, RenderMode, RENDERER_CALLBACK } from '@tramvai/tokens-render';
import { renderReact } from '../react';
import { legacyRenderer } from './legacy';
import { strictRenderer } from './strict';
import { blockingRenderer, concurrentRenderer } from './concurrent';

export function rendering({
  componentRegistry,
  log,
  consumerContext,
  customRender,
  extendRender,
  di,
  mode,
  rendererCallback,
}: {
  componentRegistry: any;
  log: any;
  consumerContext: any;
  extendRender?: typeof EXTEND_RENDER;
  customRender?: any;
  di: any;
  mode: RenderMode;
  rendererCallback?: typeof RENDERER_CALLBACK;
}) {
  let renderResult = renderReact({ componentRegistry, di }, consumerContext);

  if (extendRender) {
    each((render) => {
      renderResult = render(renderResult);
    }, extendRender);
  }

  if (customRender) {
    return customRender(renderResult);
  }

  const container = document.querySelector('.application');
  const executeRendererCallbacks = (renderErr?: Error) =>
    rendererCallback?.forEach((cb) => {
      try {
        cb(renderErr);
      } catch (cbError) {
        // eslint-disable-next-line no-console
        console.error(cbError);
      }
    });
  const callback = () => {
    log.debug('App rendering');
    document.querySelector('html').classList.remove('no-js');
    executeRendererCallbacks();
  };
  const params = { element: renderResult, container, callback, log };

  try {
    switch (mode) {
      case 'strict':
        return strictRenderer(params);
      case 'blocking':
        return blockingRenderer(params);
      case 'concurrent':
        return concurrentRenderer(params);
      case 'legacy':
      default:
        return legacyRenderer(params);
    }
  } catch (e) {
    executeRendererCallbacks(e);
    throw e;
  }
}
