import { createToken } from '@tinkoff/dippy';

export interface CookieOptions {
  expires?: number | Date | string;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
  noSubdomains?: boolean;
}

export interface CookieSetOptions extends CookieOptions {
  name: string;
  value: string;
}

export interface CookieManager {
  get(name): string;
  all(): Record<string, string>;
  set({ name, value, ...options }: CookieSetOptions): void;
  remove(name: string, options?: CookieOptions): void;
}

export const COOKIE_MANAGER_TOKEN = createToken<CookieManager>('cookieManager');
