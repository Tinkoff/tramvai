import { Module, Scope } from '@tramvai/core';
import { ENV_MANAGER_TOKEN, LOGGER_TOKEN } from '@tramvai/module-common';
import { createSentry } from './browser/sentry';
import { sharedProviders } from './shared/providers';
import {
  SENTRY_TOKEN,
  SENTRY_OPTIONS_TOKEN,
  SENTRY_DSN_TOKEN,
  SENTRY_FILTER_ERRORS,
  SENTRY_LAZY_LOADING,
} from './tokens';
import type { SentryOptions, EventHint, Event, Exception } from './types.h';

export * from './types.h';
export * from './tokens';

// не отправляем UnhandledRejection ошибки вида "Non-Error promise rejection captured with value: undefined",
// т.к. их очень много, но они не несут полезной информации для отладки и исправления
const isEmptyUnhandledRejection = (exception: Exception) => {
  return (
    exception.type === 'UnhandledRejection' &&
    /promise rejection captured with value: (undefined|null)/g.test(exception.value)
  );
};

// не отправляем ошибки загрузки статики из скрипта, который делает повторные запросы к статике,
// т.к. информации о ошибке они не содержат, а всплески таких ошибок удобнее смотреть в Sage
const isFileLoadException = (exception: Exception) => {
  return exception.type === 'Error' && /Problem with the file loading/g.test(exception.value);
};

const isUselessException = (exception: Exception) => {
  return isEmptyUnhandledRejection(exception) || isFileLoadException(exception);
};

@Module({
  providers: [
    ...sharedProviders,
    {
      provide: SENTRY_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: ({
        envManager,
        logger,
        sentryLazyLoading,
      }: {
        envManager: typeof ENV_MANAGER_TOKEN;
        logger: typeof LOGGER_TOKEN;
        sentryLazyLoading: typeof SENTRY_LAZY_LOADING;
      }) => {
        let sendGlobalErrorsCount: ((count: number) => void) | undefined;

        if (logger) {
          sendGlobalErrorsCount = (count) => {
            logger.info({
              event: 'global-errors',
              value: count,
            });
          };
        }
        return createSentry({
          sdkBundleUrl: envManager.get('SENTRY_SDK_URL'),
          lazyInjecting: sentryLazyLoading,
          sendGlobalErrorsCount,
        });
      },
      deps: {
        envManager: ENV_MANAGER_TOKEN,
        logger: { token: LOGGER_TOKEN, optional: true },
        sentryLazyLoading: SENTRY_LAZY_LOADING,
      },
    },
    {
      provide: SENTRY_DSN_TOKEN,
      useFactory: ({ envManager }: { envManager: typeof ENV_MANAGER_TOKEN }) =>
        envManager.get('SENTRY_DSN_CLIENT') || envManager.get('SENTRY_DSN'),
      deps: {
        envManager: ENV_MANAGER_TOKEN,
      },
    },
    {
      provide: SENTRY_FILTER_ERRORS,
      multi: true,
      useValue: (event: Event, hint?: EventHint) => {
        return event?.exception?.values?.every(isUselessException);
      },
    },
    {
      provide: SENTRY_LAZY_LOADING,
      useValue: true,
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
