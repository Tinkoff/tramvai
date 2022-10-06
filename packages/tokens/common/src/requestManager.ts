import { createToken } from '@tinkoff/dippy';
import type { Url } from '@tinkoff/url';

/**
 * @description
 * Instance for managing client requests (request headers, query-parameters, cookies etc).
 * Mostly used on server, but has partial functional for browser for simplification build isomorphic app
 */
export const REQUEST_MANAGER_TOKEN = createToken<RequestManager>('requestManager');

export interface RequestManager {
  getBody(): unknown;

  getUrl(): string;

  getParsedUrl(): Url;

  getMethod(): string;

  getCookie(key: string): string;

  getCookies(): Record<string, string>;

  getHeader(key: string): string | string[] | undefined;

  getHeaders(): Record<string, string | string[]>;

  getClientIp(): string;

  getHost(): string;
}
