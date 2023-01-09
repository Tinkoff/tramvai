import type { ICookies, CookieOptions } from './cookies.h';
import { applyDefaults, getExpireDate } from './utils';

export class Cookies implements ICookies {
  constructor(private defaults: CookieOptions = {}) {}

  // eslint-disable-next-line class-methods-use-this
  get(name: string): string | undefined {
    const cookies = document.cookie.split(';');

    // Iterate all cookies
    while (cookies.length) {
      const cookie = cookies.pop();

      if (!cookie) {
        break;
      }

      // Determine separator index ("name=value")
      let separatorIndex = cookie.indexOf('=');

      // IE<11 emits the equal sign when the cookie value is empty
      separatorIndex = separatorIndex < 0 ? cookie.length : separatorIndex;

      const cookieName = cookie.slice(0, separatorIndex).replace(/^\s+/, '');
      const cookieValue = cookie.slice(separatorIndex + 1);
      let cookieDecodedName: string | undefined;

      try {
        cookieDecodedName = decodeURIComponent(cookieName);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Decode cookie name error', e);
      }

      // Return cookie value if the name matches
      if (cookieDecodedName === name || cookieName === name) {
        try {
          return decodeURIComponent(cookieValue);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('Decode cookie value error', e);
          // use original cookie value, if decoding failed
          return cookieValue;
        }
      }
    }

    // Return `undefined` as the cookie was not found
    return undefined;
  }

  set(name: string, value: string, options?: CookieOptions): void {
    if (!name) {
      return;
    }

    const { domain, path, expires, secure, httpOnly, sameSite } = applyDefaults(
      options,
      this.defaults
    );
    const expireDate = getExpireDate(expires);

    // Encode cookie name
    const cookieName = name
      .replace(/[^+#$&^`|]/g, encodeURIComponent)
      .replace('(', '%28')
      .replace(')', '%29');
    // Encode cookie value (RFC6265)
    const cookieValue = (typeof value === 'string' ? value : '').replace(
      // eslint-disable-next-line no-useless-escape
      /[^+#$&/:<-\[\]-}]/g,
      encodeURIComponent
    );
    const cookieExpires =
      expireDate && expireDate.getTime() >= 0 ? `;expires=${expireDate.toUTCString()}` : '';
    const cookieDomain = domain ? `;domain=${domain}` : '';
    const cookiePath = path ? `;path=${path}` : '';
    const cookieSecure = secure ? ';secure' : '';
    const cookieHttpOnly = httpOnly ? ';httponly' : '';
    const cookieSameSite = sameSite ? `;samesite=${sameSite}` : '';

    document.cookie = `${cookieName}=${cookieValue}${cookieExpires}${cookieDomain}${cookiePath}${cookieSecure}${cookieHttpOnly}${cookieSameSite}`;
  }

  erase(name: string, options: CookieOptions = {}): void {
    this.set(name, '', {
      expires: -1,
      domain: options.domain,
      path: options.path,
      secure: false,
      httpOnly: false,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  all(): { [key: string]: string } {
    const all = {} as Record<string, any>;
    const cookies = document.cookie.split(';');

    // Iterate all cookies
    while (cookies.length) {
      const cookie = cookies.pop();

      if (!cookie) {
        break;
      }

      // Determine separator index ("name=value")
      let separatorIndex = cookie.indexOf('=');

      // IE<11 emits the equal sign when the cookie value is empty
      separatorIndex = separatorIndex < 0 ? cookie.length : separatorIndex;

      const cookieName = cookie.slice(0, separatorIndex).replace(/^\s+/, '');
      const cookieValue = cookie.slice(separatorIndex + 1);
      let cookieDecodedName: string | undefined;
      let cookieDecodedValue: string | undefined;

      try {
        cookieDecodedName = decodeURIComponent(cookieName);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Decode cookie name error', e);
      }
      try {
        cookieDecodedValue = decodeURIComponent(cookieValue);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Decode cookie value error', e);
      }

      // use original cookie name and value, if decoding failed
      all[cookieDecodedName ?? cookieName] = cookieDecodedValue ?? cookieValue;
    }

    return all;
  }
}
