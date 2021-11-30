import { createToken } from '@tinkoff/dippy';
import type { Response } from 'express';

/**
 * @description
 * Direct reference to Response instance
 */
export const RESPONSE = createToken<Response>('response');

/**
 * @description
 * Instance for managing client response (response headers, cookies, response body).
 * Mostly used on server, but has partial functional for browser for simplification build isomorphic app
 */
export const RESPONSE_MANAGER_TOKEN = createToken<ResponseManager>('responseManager');

export interface ResponseManager {
  getBody(): string;

  setBody(value: string): void;

  getHeader(key: string): string | string[];

  getHeaders(): Record<string, string | string[]>;

  setHeader(key: string, value: string): void;

  getCookie(key: string): string;

  getCookies(): Record<string, string>;

  setCookie(key: string, value: string): void;

  getStatus(): number;

  setStatus(status: number): void;
}
