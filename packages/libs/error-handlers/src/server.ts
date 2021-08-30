import type { Logger } from './types.h';

const SIGNALS = ['SIGINT', 'SIGTERM', 'SIGQUIT', 'uncaughtException'] as const;

export const globalErrorHandler = (logger: Logger = console) => {
  const handler = (signal: string, err: any) => {
    logger.error({
      event: `Shutdown:platform:server:${signal}`,
      error: err instanceof Error ? err : new Error(err),
    });

    process.exit();
  };

  SIGNALS.forEach((signal: any) => {
    process.once(signal, (err) => {
      if (process.listenerCount(signal) > 0) {
        logger.warn(`Found other handlers for '${signal}', let them perform their job`);
        // Кто-то подписан на такое же событие, даем выполниться другим подписчикам
        // это обязанность других подписчиков остановить приложение в этом случае
        // на всякий случай подписываемся еще раз, чтобы завершить приложение при повторном сигнале
        process.on(signal, handler.bind(null, signal));
      } else {
        handler(signal, err);
      }
    });
  });
};

export const unhandledRejectionHandler = (logger: Logger = console) => {
  process.on('unhandledRejection', (error) => {
    logger.error({ event: 'unhandled:reject:promise', error });
  });
};
