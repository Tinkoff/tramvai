import { CookieManager } from './cookieManager.server';

const cookies = {
  a: 'test',
};

const requestManager: any = {
  getCookies() {
    return cookies;
  },
  getHost() {
    return 'www.tinkoff.ru';
  },
};

const responseManager: any = {
  setCookie: jest.fn(),
};

describe('CookieManager.server', () => {
  let cookieManager;

  beforeEach(() => {
    cookieManager = new CookieManager({ requestManager, responseManager });
    responseManager.setCookie.mockClear();
  });

  it('should return cookie', () => {
    expect(cookieManager.get('a')).toEqual('test');
    expect(cookieManager.get('b')).toBeUndefined();
  });

  it('should set cookie', () => {
    cookieManager.set({ name: 'b', value: 'abc', expires: 35 });

    expect(cookieManager.get('b')).toBe('abc');
    expect(responseManager.setCookie).toHaveBeenCalledWith(
      'b',
      `b=abc; Path=/; Expires=${new Date(Date.now() + 35000).toUTCString()}`
    );

    cookieManager.set({ name: 'c', value: 'c', noSubdomains: true });
    expect(responseManager.setCookie).toHaveBeenCalledWith('c', `c=c; Domain=.tinkoff.ru; Path=/`);
  });

  it('should return all cookies', () => {
    expect(cookieManager.all()).toEqual({ a: 'test' });

    cookieManager.set({ name: 'b', value: 'abc' });

    expect(cookieManager.all()).toEqual({ a: 'test', b: 'abc' });

    cookieManager.set({ name: 'haha', value: 'no' });

    expect(cookieManager.all()).toEqual({ a: 'test', b: 'abc', haha: 'no' });
  });

  it('should remove cookie', () => {
    cookieManager.set({ name: 'b', value: 'abc' });

    expect(cookieManager.all()).toEqual({ a: 'test', b: 'abc' });
    expect(cookieManager.get('b')).toBe('abc');

    cookieManager.remove('b');

    expect(cookieManager.get('b')).toBe(undefined);
    expect(cookieManager.all()).toEqual({ a: 'test' });
    expect(responseManager.setCookie).toHaveBeenLastCalledWith(
      'b',
      `b=; Path=/; Expires=${new Date(0).toUTCString()}`
    );
  });

  it('should remove cookie with options', () => {
    cookieManager.set({ name: 'b', value: 'abc', path: '/test/', domain: 'test.com' });

    expect(cookieManager.all()).toEqual({ a: 'test', b: 'abc' });
    expect(cookieManager.get('b')).toBe('abc');

    cookieManager.remove('b', { path: '/test/', domain: 'test.com' });

    expect(cookieManager.get('b')).toBe(undefined);
    expect(cookieManager.all()).toEqual({ a: 'test' });
    expect(responseManager.setCookie).toHaveBeenLastCalledWith(
      'b',
      `b=; Domain=test.com; Path=/test/; Expires=${new Date(0).toUTCString()}`
    );
  });

  it('sameSite option', () => {
    cookieManager.set({ name: 'b', value: 'b', path: '/', sameSite: 'strict' });
    expect(responseManager.setCookie).toHaveBeenLastCalledWith('b', `b=b; Path=/; SameSite=Strict`);
  });
});
