import type { Severity, Scope } from '@sentry/types';
import { Breadcrumb, Event, Options, BreadcrumbHint, EventHint, Exception } from '@sentry/types';

export { Options, Breadcrumb, Event, BreadcrumbHint, EventHint, Exception };

interface MiddlewareError {
  stack?: string;
  status?: number | string;
  statusCode?: number | string;
  status_code?: number | string;
  output?: {
    statusCode?: number | string;
  };
}

/**
 * Options deciding what parts of the request to use when enhancing an event
 */
export interface SentryRequestOptions {
  ip?: boolean;
  request?: boolean | string[];
  serverName?: boolean;
  transaction?: boolean | 'path' | 'methodPath' | 'handler';
  user?: boolean | string[];
  version?: boolean;
  flushTimeout?: number;
  /**
   * Callback method deciding whether error should be captured and sent to Sentry
   */
  shouldHandleError?(error: MiddlewareError): boolean;
}

export type SentryOptions = Options | ((SentrySdk, defaultOptions?: Options) => Options);

export interface Sentry {
  // Можно передать функцию, чтобы отложенно вычислить конфигурацию для Sentry, после загрузки SDK
  init(options: SentryOptions): void;

  // Только для браузера. Принудительно загрузить SDK, если этого еще не произошло
  forceLoad(): void;

  /* Из @sentry/minimal */

  /**
   * Records a new breadcrumb which will be attached to future events.
   *
   * Breadcrumbs will be added to subsequent events to provide more context on
   * user's actions prior to an error or crash.
   *
   * @param breadcrumb The breadcrumb to record.
   */
  addBreadcrumb(breadcrumb: Breadcrumb): void;

  /**
   * Captures an exception event and sends it to Sentry.
   *
   * @param exception An exception-like object.
   * @returns The generated eventId.
   */
  captureException(exception: any): string;

  /**
   * Captures a message event and sends it to Sentry.
   *
   * @param message The message to send to Sentry.
   * @param level Define the level of the message.
   * @returns The generated eventId.
   */
  captureMessage(message: string, level?: Severity): string;

  /**
   * Captures a manually created event and sends it to Sentry.
   *
   * @param event The event to send to Sentry.
   * @returns The generated eventId.
   */
  captureEvent(event: Event): string;

  /**
   * Callback to set context information onto the scope.
   * @param callback Callback function that receives Scope.
   */
  configureScope(callback: (scope: Scope) => void): void;

  /**
   * Creates a new scope with and executes the given operation within.
   * The scope is automatically removed once the operation
   * finishes or throws.
   *
   * This is essentially a convenience function for:
   *
   *     pushScope();
   *     callback();
   *     popScope();
   *
   * @param callback that will be enclosed into push/popScope.
   */
  withScope(callback: (scope: Scope) => void): void;
}
