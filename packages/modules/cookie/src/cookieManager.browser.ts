import type { CookieOptions, ICookies } from '@tinkoff/browser-cookies';
import { Cookies } from '@tinkoff/browser-cookies';
import type { CookieManager as Interface, CookieSetOptions } from './tokens';
import { calculateExpires, trimSubdomains } from './utils';

const checkCookieEnabled = () => {
  const testCookieName = 'testcookiesenabled';

  document.cookie = testCookieName;

  if (document.cookie.indexOf(testCookieName) > -1) {
    document.cookie = `${testCookieName}; expires=Thu, 01 Jan 1970 00:00:01 GMT'`;
    return true;
  }

  return false;
};

class CookiesFallback implements ICookies {
  cache: Record<string, string>;
  constructor() {
    this.cache = Object.create(null);
  }

  get(name: string): string {
    return this.cache[name] || undefined;
  }

  set(name: string, value: string): void {
    this.cache[name] = value;
  }

  erase(name: string): void {
    delete this.cache[name];
  }

  all(): { [key: string]: string } {
    return this.cache;
  }
}

export class CookieManager implements Interface {
  private cookies: ICookies;

  constructor() {
    const isSecure = window.location.protocol === 'https:';

    this.cookies = checkCookieEnabled()
      ? new Cookies({
          sameSite: isSecure ? 'none' : 'lax',
          secure: isSecure,
        })
      : new CookiesFallback();
  }

  // eslint-disable-next-line class-methods-use-this
  get(name: string) {
    return this.cookies.get(name) || undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  set({ name, value, noSubdomains, ...options }: CookieSetOptions) {
    this.cookies.set(name, value, {
      ...options,
      expires: calculateExpires(options.expires),
      domain: noSubdomains
        ? trimSubdomains(options.domain || window.location.hostname)
        : options.domain,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  all() {
    return this.cookies.all();
  }

  // eslint-disable-next-line class-methods-use-this
  remove(name: string, options?: CookieOptions) {
    return this.cookies.erase(name, options);
  }
}
