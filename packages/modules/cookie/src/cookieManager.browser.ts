import type { CookieOptions, ICookies } from '@tinkoff/browser-cookies';
import { Cookies } from '@tinkoff/browser-cookies';
import type { USER_AGENT_TOKEN } from '@tramvai/module-client-hints';
import type { CookieManager as Interface, CookieSetOptions } from './tokens';
import { prepareCookieOptions } from './utils';

const checkCookieEnabled = (setSameSiteNone = false) => {
  const testCookieName = 'testcookiesenabled';

  // В cross-site iframe нельзя записать куки без явного указания SameSite=None
  // источник: https://bugs.chromium.org/p/chromium/issues/detail?id=1062162#c3
  const testCookie = setSameSiteNone ? `${testCookieName}; SameSite=None; Secure` : testCookieName;
  document.cookie = testCookie;

  if (document.cookie.indexOf(testCookieName) > -1) {
    document.cookie = `${testCookie}; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    return true;
  }

  return false;
};

class CookiesFallback implements ICookies {
  cache: Record<string, string>;
  constructor() {
    this.cache = Object.create(null);
  }

  get(name: string): string | undefined {
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

  private userAgent: typeof USER_AGENT_TOKEN;

  constructor({
    cookieOptions = {},
    userAgent,
  }: {
    cookieOptions?: CookieOptions;
    userAgent: typeof USER_AGENT_TOKEN;
  }) {
    const isSecure = window.location.protocol === 'https:';

    const finalCookieOptions: CookieOptions = {
      sameSite: userAgent.sameSiteNoneCompatible && isSecure ? 'none' : 'lax',
      secure: isSecure,
      ...cookieOptions,
    };

    this.cookies = checkCookieEnabled(finalCookieOptions.sameSite === 'none')
      ? new Cookies(finalCookieOptions)
      : new CookiesFallback();

    this.userAgent = userAgent;
  }

  // eslint-disable-next-line class-methods-use-this
  get(name: string) {
    return this.cookies.get(name) || undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  set({ name, value, ...options }: CookieSetOptions) {
    this.cookies.set(
      name,
      value,
      prepareCookieOptions(
        {
          userAgent: this.userAgent,
          defaultHost: window.location.hostname,
          secureProtocol: window.location.protocol === 'https:',
        },
        options
      )
    );
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
