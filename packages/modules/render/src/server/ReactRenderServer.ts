import { renderToString } from 'react-dom/server';
import type { DI_TOKEN } from '@tramvai/core';
import type { CONTEXT_TOKEN } from '@tramvai/module-common';
import type { EXTEND_RENDER, CUSTOM_RENDER } from '@tramvai/tokens-render';
import type { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
import each from '@tinkoff/utils/array/each';
import type { ChunkExtractor } from '@loadable/server';
import { renderReact } from '../react';

export class ReactRenderServer {
  customRender: typeof CUSTOM_RENDER;

  extendRender: typeof EXTEND_RENDER;

  context: typeof CONTEXT_TOKEN;

  pageService: typeof PAGE_SERVICE_TOKEN;

  di: typeof DI_TOKEN;

  constructor({ pageService, context, customRender, extendRender, di }) {
    this.pageService = pageService;
    this.context = context;
    this.customRender = customRender;
    this.extendRender = extendRender;
    this.di = di;
  }

  render(extractor: ChunkExtractor): Promise<string> {
    let renderResult = renderReact(
      { pageService: this.pageService, di: this.di, initialState: null },
      this.context
    );

    each((render) => {
      renderResult = render(renderResult);
    }, this.extendRender ?? []);

    renderResult = extractor.collectChunks(renderResult);

    if (this.customRender) {
      return this.customRender(renderResult);
    }

    return Promise.resolve(renderToString(renderResult));
  }
}
