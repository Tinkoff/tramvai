import { Module, Scope, provide } from '@tramvai/core';
import { ENV_MANAGER_TOKEN, ENV_USED_TOKEN } from '@tramvai/tokens-common';
import { WEB_FASTIFY_APP_LIMITER_TOKEN } from '@tramvai/tokens-server-private';
import { DEFAULT_OPTIONS, fastifyRequestsLimiter, RequestLimiter } from './requestLimiter';
import {
  REQUESTS_LIMITER_TOKEN,
  REQUESTS_LIMITER_OPTIONS_TOKEN,
  REQUESTS_LIMITER_ACTIVATE_TOKEN,
} from './tokens';

export * from './requestLimiter';
export * from './tokens';

@Module({
  providers: [
    provide({
      provide: ENV_USED_TOKEN,
      multi: true,
      useValue: [
        {
          key: 'REQUEST_LIMITER_MELD',
          optional: true,
          value: String(DEFAULT_OPTIONS.maxEventLoopDelay),
        },
        {
          key: 'REQUEST_LIMITER_QUEUE',
          optional: true,
          value: String(DEFAULT_OPTIONS.queue),
        },
        {
          key: 'REQUEST_LIMITER_LIMIT',
          optional: true,
          value: String(DEFAULT_OPTIONS.limit),
        },
      ],
    }),
    provide({
      provide: REQUESTS_LIMITER_OPTIONS_TOKEN,
      useFactory: ({ envManager }) => ({
        maxEventLoopDelay: Number(envManager.get('REQUEST_LIMITER_MELD')),
        queue: Number(envManager.get('REQUEST_LIMITER_QUEUE')),
        limit: Number(envManager.get('REQUEST_LIMITER_LIMIT')),
      }),
      deps: {
        envManager: ENV_MANAGER_TOKEN,
      },
    }),

    provide({
      provide: REQUESTS_LIMITER_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: ({ options, featureEnable, envManager }) => {
        if (featureEnable === false) {
          return;
        }

        const meld = envManager.get('REQUEST_LIMITER_MELD');
        const queue = envManager.get('REQUEST_LIMITER_QUEUE');
        const limit = envManager.get('REQUEST_LIMITER_LIMIT');

        const resultOptions = {
          limit: limit ? Number(limit) : options?.limit ?? DEFAULT_OPTIONS.limit,
          queue: queue ? Number(queue) : options?.queue ?? DEFAULT_OPTIONS.queue,
          maxEventLoopDelay: meld
            ? Number(meld)
            : options?.maxEventLoopDelay ?? DEFAULT_OPTIONS.maxEventLoopDelay,
          error: options?.error ?? DEFAULT_OPTIONS.error,
        };

        return new RequestLimiter(resultOptions);
      },
      deps: {
        options: { token: REQUESTS_LIMITER_OPTIONS_TOKEN, optional: true },
        featureEnable: { token: REQUESTS_LIMITER_ACTIVATE_TOKEN, optional: true },
        envManager: ENV_MANAGER_TOKEN,
      },
    }),
    provide({
      provide: WEB_FASTIFY_APP_LIMITER_TOKEN,
      multi: true,
      useFactory: ({ requestsLimiter, featureEnable }) => {
        return async (app) => {
          if (featureEnable === false) {
            return;
          }

          await fastifyRequestsLimiter(app, { requestsLimiter });
        };
      },
      deps: {
        requestsLimiter: REQUESTS_LIMITER_TOKEN,
        featureEnable: { token: REQUESTS_LIMITER_ACTIVATE_TOKEN, optional: true },
      },
    }),
  ],
})
export class RequestLimiterModule {}
