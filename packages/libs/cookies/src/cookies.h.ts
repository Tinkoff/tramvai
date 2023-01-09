export interface CookieOptions {
  expires?: number | Date | string;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
}

export interface ICookies {
  get(name: string): string | undefined;

  set(name: string, value: string, options?: CookieOptions): void;

  erase(name: string, options?: CookieOptions): void;

  all(): { [key: string]: string };
}
