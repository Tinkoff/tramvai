import pick from '@tinkoff/utils/object/pick';
import { Module, provide, Scope } from '@tramvai/core';
import { RENDER_SLOTS, ResourceType, ResourceSlot } from '@tramvai/tokens-render';
import { ENV_MANAGER_TOKEN, ENV_USED_TOKEN, REQUEST_MANAGER_TOKEN } from '@tramvai/module-common';
import { WEB_FASTIFY_APP_AFTER_ERROR_TOKEN } from '@tramvai/tokens-server-private';
import { REGISTER_INSTANT_METRIC_TOKEN, METRICS_MODULE_TOKEN } from '@tramvai/tokens-metrics';
import type { ExtractTokenType } from '@tinkoff/dippy';
import { createSentry } from './server/sentry';
import { sharedProviders } from './shared/providers';
import { createErrorInterceptor } from './browser/inlineErrorInterceptor.inline';
import { ERROR_INTERCEPTOR, SENTRY_SDK_URL } from './shared/constants';
import {
  SENTRY_TOKEN,
  SENTRY_OPTIONS_TOKEN,
  SENTRY_REQUEST_OPTIONS_TOKEN,
  SENTRY_DSN_TOKEN,
  SENTRY_SERVER_ENABLE_DEFAULT_HANDLERS,
} from './tokens';
import type { SentryOptions } from './types.h';

export * from './types.h';
export * from './tokens';

const composeOptions = (multiOptions, defaultOptions?) =>
  (multiOptions ?? []).reduce(
    (previousOptions, options) => ({
      ...previousOptions,
      ...options,
    }),
    defaultOptions
  );

@Module({
  providers: [
    ...sharedProviders,
    provide({
      provide: SENTRY_SERVER_ENABLE_DEFAULT_HANDLERS,
      useValue: false,
    }),
    provide({
      provide: SENTRY_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: createSentry,
    }),
    provide({
      provide: REGISTER_INSTANT_METRIC_TOKEN,
      multi: true,
      useFactory: ({ metrics }) =>
        [
          'global-errors',
          metrics?.counter({
            name: 'client_system_globalErrors_total',
            help: 'Shows count of unhandled errors and unhandled rejections',
          }),
        ] as ExtractTokenType<typeof REGISTER_INSTANT_METRIC_TOKEN>,
      deps: {
        metrics: {
          token: METRICS_MODULE_TOKEN,
          optional: true,
        },
      },
    }),
    provide({
      provide: WEB_FASTIFY_APP_AFTER_ERROR_TOKEN,
      multi: true,
      useFactory: ({ sentry, requestOptions, enableDefaultHandlers }) => {
        return (error: any, request, reply) => {
          const status = error.httpStatus || error.statusCode || 500;

          if (enableDefaultHandlers && status >= 500) {
            const options = composeOptions(requestOptions, {
              // code from https://github.com/getsentry/sentry-javascript/blob/4e722eb8778e27d7910e96ccb1aac108bcbea146/packages/node/src/handlers.ts#L309
              ip: false,
              request: true,
              serverName: true,
              transaction: true,
              user: true,
              version: true,
            });

            // TODO: migrate to the sentry fastify handler in case it is released by the [issue](https://github.com/getsentry/sentry-javascript/issues/4784)
            sentry.withScope((scope) => {
              if (options.ip) {
                scope.setUser({
                  ip_address: request.ip,
                });
              }

              if (options.request) {
                scope.setExtras({
                  request:
                    options.request === true
                      ? pick(['cookies', 'headers', 'method', 'query', 'url'], request)
                      : pick(options.request, request),
                });
              }

              sentry.captureException(error);
            });
          }
        };
      },
      deps: {
        sentry: SENTRY_TOKEN,
        enableDefaultHandlers: SENTRY_SERVER_ENABLE_DEFAULT_HANDLERS,
        requestOptions: {
          token: SENTRY_REQUEST_OPTIONS_TOKEN,
          optional: true,
        },
      },
    }),
    provide({
      provide: RENDER_SLOTS,
      multi: true,
      useFactory: () => {
        return {
          slot: ResourceSlot.HEAD_CORE_SCRIPTS,
          type: ResourceType.inlineScript,
          payload: `(${createErrorInterceptor})('${ERROR_INTERCEPTOR}')`,
        };
      },
    }),
    provide({
      provide: ENV_USED_TOKEN,
      useValue: [
        { key: 'SENTRY_DSN', optional: true, dehydrate: true },
        { key: 'SENTRY_DSN_CLIENT', optional: true, dehydrate: true },
        {
          key: 'SENTRY_SDK_URL',
          dehydrate: true,
          optional: true,
          value: SENTRY_SDK_URL,
        },
        { key: 'SENTRY_ENVIRONMENT', optional: true, dehydrate: true },
        { key: 'SENTRY_RELEASE', optional: true, dehydrate: true },
      ],
      multi: true,
    }),
    provide({
      provide: SENTRY_DSN_TOKEN,
      useFactory: ({ envManager }: { envManager: typeof ENV_MANAGER_TOKEN }) =>
        envManager.get('SENTRY_DSN'),
      deps: {
        envManager: ENV_MANAGER_TOKEN,
      },
    }),
  ],
})
export class SentryModule {
  static forRoot(options: SentryOptions) {
    return {
      mainModule: SentryModule,
      providers: [
        {
          provide: SENTRY_OPTIONS_TOKEN,
          multi: true,
          useValue: options,
        },
      ],
    };
  }
}
