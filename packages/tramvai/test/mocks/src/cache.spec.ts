import { createMockCache } from './cache';

describe('test/mocks/cache', () => {
  it('default', () => {
    const cache = createMockCache();

    expect(cache.has('a')).toBe(false);
    expect(cache.get('a')).toBeUndefined();
  });

  it('entries', () => {
    const cache = createMockCache({ a: 'aaa' });

    expect(cache.has('a')).toBe(true);
    expect(cache.get('a')).toBe('aaa');
  });
});
