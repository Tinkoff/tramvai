import { createToken } from '@tinkoff/dippy';
import type { ApiService, HttpClient } from '@tramvai/http-client';
import type { TinkoffRequestOptions, Agent } from '@tramvai/tinkoff-request-http-client-adapter';

export type HttpClientFactoryOptions = TinkoffRequestOptions & { name: string };

/**
 * @description
 * Factory of HTTP clients with minimal base settings
 */
export const HTTP_CLIENT_FACTORY = createToken<(options: HttpClientFactoryOptions) => HttpClient>(
  'HTTP_CLIENT_FACTORY'
);

/**
 * @description
 * Universal HTTP client for arbitrary requests
 */
export const HTTP_CLIENT = createToken<HttpClient>('HTTP_CLIENT');

/**
 * @description
 * Global HTTP and HTTPS agents for all clients
 * https://nodejs.org/dist/latest-v16.x/docs/api/http.html#class-httpagent
 */
export const HTTP_CLIENT_AGENT = createToken<{
  http: Agent;
  https: Agent;
}>('HTTP_CLIENT_AGENT');

/**
 * @description
 * List of HTTP headers that are proxied from app request to all of the backend API
 */
export const API_CLIENT_PASS_HEADERS = createToken<string[]>('apiClientPassHeaders', {
  multi: true,
});

/**
 * @description
 * Internal api for app server.
 * Uses the value of `APP_INFO_TOKEN` from di for constructing the request address
 */
export const PAPI_SERVICE = createToken<ApiService>('papi service');

/**
 * @description
 * Enable or disable circuit breaker
 */
export const DISABLE_CIRCUIT_BREAKER = createToken<boolean>('disable circuit breaker');
