import { createMockCookieManager } from './cookie';

describe('test/mocks/cookie', () => {
  it('test', () => {
    const cookieManager = createMockCookieManager();

    expect(cookieManager.get('a')).toBeUndefined();

    cookieManager.set({ name: 'a', value: 'aaa' });

    expect(cookieManager.get('a')).toBe('aaa');
  });
});
