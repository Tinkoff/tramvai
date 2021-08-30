import type { CookieOptions } from './cookies.h';

const DEFAULT_PATH = '/';
const MS_IN_DAY = 864e5;

/**
 * Apply default value for unspecified options
 */
export function applyDefaults(
  options: CookieOptions = {},
  defaults: CookieOptions = {}
): CookieOptions {
  const expires = options.expires || defaults.expires;
  const domain = options.domain || defaults.domain;
  const path = options.path ?? defaults.path ?? DEFAULT_PATH;
  const secure = options.secure ?? defaults.secure;
  const httpOnly = options.httpOnly ?? defaults.httpOnly;
  const sameSite = options.sameSite ?? defaults.sameSite;

  return {
    expires,
    domain,
    path,
    secure,
    httpOnly,
    sameSite,
  };
}

/**
 * Determine cookie expiration date
 * If succesful the result will be a valid Date, otherwise it will be an invalid Date or false(ish)
 */
export function getExpireDate(expires?: number | string | Date): Date | null {
  const expireDate = expires
    ? new Date(
        // in case expires is an integer, it should specify the number of days till the cookie expires
        typeof expires === 'number'
          ? new Date().getTime() + expires * MS_IN_DAY
          : // else expires should be either a Date object or in a format recognized by Date.parse()
            expires
      )
    : null;

  return expireDate;
}
