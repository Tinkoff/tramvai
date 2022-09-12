import { PrefixTree } from './PrefixTree';

describe('PrefixTree', () => {
  [
    ['http://example.com/api/v1/test', 'API', 'get value by longest url'],
    ['http://example.com/foo/bar', 'SITE', 'get value by short url'],
  ].forEach(([key, res, title]) => {
    it(`${title}`, () => {
      const prefixTree = new PrefixTree<string>({ delimiter: '/' });
      prefixTree.set('http://example.com/', 'SITE');
      prefixTree.set('http://example.com/api/', 'API');
      expect(prefixTree.get(key)).toBe(res);
    });
  });

  it('get value after update', () => {
    const prefixTree = new PrefixTree<string>({ delimiter: '/' });
    prefixTree.set('http://example.com/', 'SITE');
    prefixTree.set('http://example.com/', 'API');
    expect(prefixTree.get('http://example.com/api/v1/test')).toBe('API');
  });

  it('get value after functional update', () => {
    const prefixTree = new PrefixTree<{ uno?: number; dos?: number }>({
      delimiter: '/',
    });
    prefixTree.set('http://example.com/', { uno: 1 });
    prefixTree.set('http://example.com/', (value) => ({ ...value, dos: 2 }));
    expect(prefixTree.get('http://example.com/api/v1/test')).toEqual({ uno: 1, dos: 2 });
  });
});
