import { createToken } from '@tinkoff/dippy';
import type { Request } from 'express';
import type { FastifyRequest as OriginalFastifyRequest } from 'fastify';

// HACK: to prevent inlining of Request and providing internal express dependencies to outside
type RequestExt = Request;
type FastifyRequest = OriginalFastifyRequest & {
  cookies: Record<string, string>;
  query: Record<string, string>;
};
/**
 * @deprecated use FASTIFY_REQUEST
 * @description
 * Direct reference to request object
 */
export const REQUEST = createToken<RequestExt>('request');

/**
 * @description
 * Direct reference to request object
 */
export const FASTIFY_REQUEST = createToken<FastifyRequest>('fastify request');

/**
 * @description
 * Instance for managing client requests (request headers, query-parameters, cookies etc).
 * Mostly used on server, but has partial functional for browser for simplification build isomorphic app
 */
export const REQUEST_MANAGER_TOKEN = createToken<RequestManager>('requestManager');

export interface RequestManager {
  getBody(): unknown;

  getUrl(): string;

  getMethod(): string;

  getCookie(key: string): string;

  getCookies(): Record<string, string>;

  getHeader(key: string): string | string[];

  getHeaders(): Record<string, string | string[]>;

  getClientIp(): string;

  getHost(): string;
}
