import { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { createPapiMethod } from '@tramvai/papi';
import { SERVER_MODULE_PAPI_PRIVATE_ROUTE } from '@tramvai/tokens-server';
import { Module, Scope, commandLineListTokens } from '@tramvai/core';
import { parse } from '@tinkoff/url';
import { EventEmitter } from 'events';
import monkeypatch from '@tinkoff/monkeypatch';
import http from 'http';
import https from 'https';

class Interceptor {
  public intercepted = false;

  public delay = 0;

  setIntercept(intercept) {
    this.intercepted = intercept;
  }

  setDelay(delay: number) {
    this.intercepted = true;
    this.delay = delay;
  }

  clear() {
    this.intercepted = false;
    this.delay = 0;
  }

  getStatus() {
    return {
      intercepted: this.intercepted,
      delay: this.delay,
    };
  }
}

interface Deps {
  logger: typeof LOGGER_TOKEN;
  interceptor: Interceptor;
}

const INTERCEPTOR_TOKEN = 'debugRequestsInterceptor';

@Module({
  providers: [
    {
      provide: INTERCEPTOR_TOKEN,
      useClass: Interceptor,
      scope: Scope.SINGLETON,
    },
    {
      provide: commandLineListTokens.init,
      multi: true,
      useFactory: ({ logger, interceptor }: Deps) => {
        const log = logger('server:node-debug:request');

        return function debugHttp() {
          const handler = (request, options, cb) => {
            const parsed = typeof options === 'string' ? parse(options) : options;
            const wasHandled = typeof cb === 'function';

            return request(options, cb)
              .on('response', (response) => {
                interceptor.intercepted &&
                  monkeypatch({
                    obj: response,
                    method: 'emit',
                    handler: (emit, event, ...args) => {
                      if (event === 'end') {
                        setTimeout(() => {
                          emit(event, ...args);
                        }, interceptor.delay);

                        return !!response.listenerCount(event);
                      }

                      return emit(event, ...args);
                    },
                  });
              })
              .on('response', (response) => {
                // Workaround for res._dump in Node.JS http client
                // https://github.com/nodejs/node/blob/20285ad17755187ece16b8a5effeaa87f5407da2/lib/_http_client.js#L421-L427
                if (!wasHandled && EventEmitter.listenerCount(response.req, 'response') === 0) {
                  response.resume();
                }

                log.debug(`${response.statusCode}
${parsed.href || `${parsed.protocol}//${parsed.hostname}${parsed.path}`}
`);
              })
              .on('error', (error) => {
                log.error({
                  event: 'request-failed',
                  error,
                  url: parsed.href || options,
                });
              });
          };

          monkeypatch({ obj: http, method: 'request', handler });
          monkeypatch({ obj: https, method: 'request', handler });
        };
      },
      deps: {
        logger: LOGGER_TOKEN,
        interceptor: INTERCEPTOR_TOKEN,
      },
    },
    {
      provide: SERVER_MODULE_PAPI_PRIVATE_ROUTE,
      multi: true,
      useFactory: ({ interceptor }: Deps) => {
        return createPapiMethod({
          method: 'post',
          path: '/debug-http-request',
          async handler({ req }) {
            const { delay = 10000 } = req.body;

            if (delay) {
              interceptor.setDelay(delay);
            } else {
              interceptor.setIntercept(true);
            }

            return interceptor.getStatus();
          },
        });
      },
      deps: {
        interceptor: INTERCEPTOR_TOKEN,
      },
    },
    {
      provide: SERVER_MODULE_PAPI_PRIVATE_ROUTE,
      multi: true,
      useFactory: ({ interceptor }: Deps) => {
        return createPapiMethod({
          method: 'delete',
          path: '/debug-http-request',
          async handler() {
            interceptor.clear();
            return interceptor.getStatus();
          },
        });
      },
      deps: {
        interceptor: INTERCEPTOR_TOKEN,
      },
    },
  ],
})
export class DebugHttpRequestsModule {}
