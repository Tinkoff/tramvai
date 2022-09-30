import { getCacheKey, parseCacheKey } from './cacheKey';

describe('cacheKey', () => {
  it('getCacheKey', () => {
    expect(
      getCacheKey({
        method: 'GET',
        host: 'localhost',
        path: '/test',
        deviceType: 'desktop',
        modern: true,
      })
    ).toBe('GET=localhost=/test=desktop=modern');

    expect(
      getCacheKey({
        method: 'GET',
        host: 'localhost',
        path: '/test',
        deviceType: 'mobile',
        modern: false,
      })
    ).toBe('GET=localhost=/test=mobile=default');
  });

  it('parseCacheKey', () => {
    const key1 = getCacheKey({
      method: 'GET',
      host: 'localhost',
      path: '/test',
      deviceType: 'desktop',
      modern: true,
    });

    expect(parseCacheKey(key1)).toEqual(['GET', 'localhost', '/test', 'desktop', 'modern']);

    const key2 = getCacheKey({
      method: 'GET',
      host: 'localhost',
      path: '/test',
      deviceType: 'mobile',
      modern: false,
    });

    expect(parseCacheKey(key2)).toEqual(['GET', 'localhost', '/test', 'mobile', 'default']);
  });
});
