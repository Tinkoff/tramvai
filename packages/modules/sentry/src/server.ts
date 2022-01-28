import noop from '@tinkoff/utils/function/noop';
import { Module, Scope } from '@tramvai/core';
import { RENDER_SLOTS, ResourceType, ResourceSlot } from '@tramvai/module-render';
import { ENV_MANAGER_TOKEN, ENV_USED_TOKEN } from '@tramvai/module-common';
import { WEB_APP_BEFORE_INIT_TOKEN, WEB_APP_AFTER_INIT_TOKEN } from '@tramvai/tokens-server';
import { REGISTER_INSTANT_METRIC_TOKEN, METRICS_MODULE_TOKEN } from '@tramvai/tokens-metrics';
import * as Sentry from '@sentry/node';
import { createSentry } from './server/sentry';
import { sharedProviders } from './shared/providers';
import { createErrorInterceptor } from './browser/inlineErrorInterceptor.inline';
import { ERROR_INTERCEPTOR, SENTRY_SDK_URL } from './shared/constants';
import {
  SENTRY_TOKEN,
  SENTRY_OPTIONS_TOKEN,
  SENTRY_REQUEST_OPTIONS_TOKEN,
  SENTRY_DSN_TOKEN,
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
    {
      provide: SENTRY_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: createSentry,
    },
    {
      provide: REGISTER_INSTANT_METRIC_TOKEN,
      multi: true,
      useFactory: ({ metrics }: { metrics?: typeof METRICS_MODULE_TOKEN }) => [
        'global-errors',
        metrics?.counter({
          name: 'client_system_globalErrors_total',
          help: 'Shows count of unhandled errors and unhandled rejections',
        }),
      ],
      deps: {
        metrics: {
          token: METRICS_MODULE_TOKEN,
          optional: true,
        },
      },
    },
    {
      provide: WEB_APP_BEFORE_INIT_TOKEN,
      multi: true,
      useFactory: ({ multiOptions }) => {
        return (app) => {
          const sentryHandler = Sentry.Handlers.requestHandler(composeOptions(multiOptions));

          app.use((req, res, next) => {
            // suddenly, sentry uses nodejs's module `domain` in order to catch all of the error that happens when handling requests
            // including async one, [see code](https://github.com/getsentry/sentry-javascript/blob/8cbcff25235b8d67043820032dba7a9e9cae3a2a/packages/node/src/handlers.ts#L415)
            // and now, imagine, some of the code in this request creates async function out of main promise chain that throws
            // sentry will handle that error as usual error and will call express error handler leading to 500-page for error that is not important and might be handled by unhandledPromiseRejection
            // that also may lead to double error handling by the express app in case the `next` function is called twice - [issue](https://github.com/expressjs/express/issues/3024)
            // we will handle most of the errors for request by ourselves and sentry still will send errors by its `errorHandler` below
            sentryHandler(req, res, noop);
            setImmediate(next);
          });
        };
      },
      deps: {
        multiOptions: {
          token: SENTRY_REQUEST_OPTIONS_TOKEN,
          optional: true,
        },
      },
    },
    {
      provide: WEB_APP_AFTER_INIT_TOKEN,
      multi: true,
      useFactory: ({ multiOptions }) => {
        return (app) => {
          app.use(Sentry.Handlers.errorHandler(composeOptions(multiOptions)));
        };
      },
      deps: {
        multiOptions: {
          token: SENTRY_REQUEST_OPTIONS_TOKEN,
          optional: true,
        },
      },
    },
    {
      provide: RENDER_SLOTS,
      multi: true,
      useFactory: () => {
        return {
          slot: ResourceSlot.HEAD_CORE_SCRIPTS,
          type: ResourceType.inlineScript,
          payload: `(${createErrorInterceptor})('${ERROR_INTERCEPTOR}')`,
        };
      },
    },
    {
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
    },
    {
      provide: SENTRY_DSN_TOKEN,
      useFactory: ({ envManager }: { envManager: typeof ENV_MANAGER_TOKEN }) =>
        envManager.get('SENTRY_DSN'),
      deps: {
        envManager: ENV_MANAGER_TOKEN,
      },
    },
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
