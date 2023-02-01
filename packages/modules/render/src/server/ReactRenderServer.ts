import { Writable } from 'stream';
import type { ExtractDependencyType } from '@tinkoff/dippy';
import type { DI_TOKEN } from '@tramvai/core';
import type { CONTEXT_TOKEN, LOGGER_TOKEN } from '@tramvai/module-common';
import type {
  EXTEND_RENDER,
  CUSTOM_RENDER,
  REACT_SERVER_RENDER_MODE,
} from '@tramvai/tokens-render';
import each from '@tinkoff/utils/array/each';
import type { ChunkExtractor } from '@loadable/server';
import { renderReact } from '../react';

const RENDER_TIMEOUT = 500;

class HtmlWritable extends Writable {
  private chunks: Buffer[] = [];
  private html = '';

  getHtml() {
    return this.html;
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    callback();
  }

  _final(callback) {
    this.html = Buffer.concat(this.chunks).toString();
    callback();
  }
}

export class ReactRenderServer {
  customRender: typeof CUSTOM_RENDER;

  extendRender: ExtractDependencyType<typeof EXTEND_RENDER>;

  context: typeof CONTEXT_TOKEN;

  di: typeof DI_TOKEN;

  log: ReturnType<typeof LOGGER_TOKEN>;

  renderMode: typeof REACT_SERVER_RENDER_MODE;

  // eslint-disable-next-line sort-class-members/sort-class-members
  constructor({ context, customRender, extendRender, di, renderMode, logger }) {
    this.context = context;
    this.customRender = customRender;
    this.extendRender = extendRender;
    this.di = di;
    this.renderMode = renderMode;
    this.log = logger('module-render');
  }

  render(extractor: ChunkExtractor): Promise<string> {
    let renderResult = renderReact({ di: this.di }, this.context);

    each((render) => {
      renderResult = render(renderResult);
    }, this.extendRender ?? []);

    renderResult = extractor.collectChunks(renderResult);

    if (this.customRender) {
      return this.customRender(renderResult);
    }

    if (process.env.__TRAMVAI_CONCURRENT_FEATURES && this.renderMode === 'streaming') {
      return new Promise((resolve, reject) => {
        const { renderToPipeableStream } = require('react-dom/server');
        const htmlWritable = new HtmlWritable();

        htmlWritable.on('finish', () => {
          resolve(htmlWritable.getHtml());
        });

        const start = Date.now();
        const { log } = this;

        log.info({
          event: 'streaming-render:start',
        });

        const { pipe, abort } = renderToPipeableStream(renderResult, {
          onAllReady() {
            log.info({
              event: 'streaming-render:complete',
              duration: Date.now() - start,
            });

            // here `write` will be called only once
            pipe(htmlWritable);
          },
          onError(error) {
            // error can be inside Suspense boundaries, this is not critical, continue rendering.
            // for criticall errors, this callback will be called with `onShellError`,
            // so this is a best place to error logging
            log.error({
              event: 'streaming-render:error',
              error,
            });
          },
          onShellError(error) {
            // always critical error, abort rendering
            reject(error);
          },
        });

        setTimeout(() => {
          abort();
          reject(new Error('React renderToPipeableStream timeout exceeded'));
        }, RENDER_TIMEOUT);
      });
    }

    const { renderToString } = require('react-dom/server');
    return Promise.resolve(renderToString(renderResult));
  }
}
