/**
 * @jest-environment jsdom
 */
import { CookieManager } from './cookieManager.browser';
import { prepareCookieOptions } from './utils';

jest.mock('./utils', () => {
  const utils = jest.requireActual('./utils');

  return {
    ...utils,
    prepareCookieOptions: jest.fn(utils.prepareCookieOptions),
  };
});

document.cookie = 'a=test';

describe('CookieManager.browser', () => {
  let cookieManager: CookieManager;

  beforeEach(() => {
    cookieManager = new CookieManager({ userAgent: {} as any });
    cookieManager.remove('b');
    cookieManager.remove('c');
  });

  it('should return cookie', () => {
    expect(cookieManager.get('a')).toEqual('test');
    expect(cookieManager.get('b')).toBeUndefined();
  });

  it('should set cookie', () => {
    cookieManager.set({ name: 'b', value: 'abc', expires: 35 });

    expect(cookieManager.get('b')).toBe('abc');
  });

  it('should return all cookies', () => {
    expect(cookieManager.all()).toEqual({ a: 'test' });

    cookieManager.set({ name: 'b', value: 'abc' });

    expect(cookieManager.all()).toEqual({ a: 'test', b: 'abc' });

    cookieManager.set({ name: 'c', value: 'no' });

    expect(cookieManager.all()).toEqual({ a: 'test', b: 'abc', c: 'no' });
  });

  it('should remove cookie', () => {
    cookieManager.set({ name: 'b', value: 'abc' });

    expect(cookieManager.all()).toEqual({ a: 'test', b: 'abc' });
    expect(cookieManager.get('b')).toBe('abc');

    cookieManager.remove('b');

    expect(cookieManager.get('b')).toBe(undefined);
    expect(cookieManager.all()).toEqual({ a: 'test' });
  });

  it('should remove cookie with options', () => {
    cookieManager.set({ name: 'b', value: 'b', path: '/' });
    cookieManager.set({ name: 'c', value: 'c' });

    expect(cookieManager.all()).toEqual({ a: 'test', b: 'b', c: 'c' });

    cookieManager.remove('b', { path: '/test/' });
    expect(cookieManager.get('b')).toBe('b');
    expect(cookieManager.all()).toEqual({ a: 'test', b: 'b', c: 'c' });

    cookieManager.remove('b', { path: '/' });
    expect(cookieManager.get('b')).toBe(undefined);
    expect(cookieManager.all()).toEqual({ a: 'test', c: 'c' });

    cookieManager.remove('c', { domain: 'test.domain' });
    expect(cookieManager.get('c')).toBe('c');
    expect(cookieManager.all()).toEqual({ a: 'test', c: 'c' });

    cookieManager.remove('c');
    expect(cookieManager.get('c')).toBe(undefined);
    expect(cookieManager.all()).toEqual({ a: 'test' });
  });

  it('sameSite option', () => {
    cookieManager.set({ name: 'b', value: 'b', path: '/', sameSite: 'strict' });
    expect(document.cookie).toContain('b=b');
  });

  it('prepareCookieOptions should be called', () => {
    cookieManager.set({ name: 'b', value: 'b' });

    expect(prepareCookieOptions).toHaveBeenCalled();
  });

  describe('checks for enabled cookies', () => {
    let cookiesValue = '';
    const cookieGetMock = jest.fn().mockImplementation(() => {
      return cookiesValue;
    });
    const cookieSetMock = jest.fn().mockImplementation((nextCookiesValue) => {
      cookiesValue = nextCookiesValue;
    });

    beforeEach(() => {
      cookieGetMock.mockClear();
      cookieSetMock.mockClear();
      cookiesValue = '';
      Object.defineProperty(document, 'cookie', {
        get: cookieGetMock,
        set: cookieSetMock,
      });
    });

    it('should set testcookies without samesite by default', () => {
      const _cookieManager = new CookieManager({ userAgent: {} as any });
      expect(cookieSetMock).toHaveBeenNthCalledWith(1, 'testcookiesenabled=');
    });

    it('should set default testcookies without SameSite: none if protocol is not secure for compactible userAgent', () => {
      const _cookieManager = new CookieManager({
        userAgent: { sameSiteNoneCompatible: true } as any,
      });
      expect(cookieSetMock).toHaveBeenNthCalledWith(1, 'testcookiesenabled=');
    });

    it('should set default testcookies with SameSite: none if protocol is secure for compactible userAgent', () => {
      const originalLocation = window.location;
      // Мокаем window.location для проверки протокола
      // @ts-ignore
      delete window.location;
      // @ts-ignore
      window.location = new URL('https://google.com');

      const _cookieManager = new CookieManager({
        userAgent: { sameSiteNoneCompatible: true } as any,
      });
      expect(cookieSetMock).toHaveBeenNthCalledWith(
        1,
        'testcookiesenabled=; SameSite=None; Secure'
      );

      window.location = originalLocation;
    });

    it('should set testcookies with SameSite: none if option is explicitly passed', () => {
      const _cookieManager = new CookieManager({
        userAgent: {} as any,
        cookieOptions: {
          sameSite: 'none',
        },
      });
      expect(cookieSetMock).toHaveBeenNthCalledWith(
        1,
        'testcookiesenabled=; SameSite=None; Secure'
      );
    });

    it('should set testcookies without SameSite if SameSite is set to lax', () => {
      const _cookieManager = new CookieManager({
        userAgent: {} as any,
        cookieOptions: {
          sameSite: 'lax',
        },
      });
      expect(cookieSetMock).toHaveBeenNthCalledWith(1, 'testcookiesenabled=');
    });

    it('should set testcookies without SameSite if SameSite is set to strict', () => {
      const _cookieManager = new CookieManager({
        userAgent: {} as any,
        cookieOptions: {
          sameSite: 'strict',
        },
      });
      expect(cookieSetMock).toHaveBeenNthCalledWith(1, 'testcookiesenabled=');
    });
  });
});
