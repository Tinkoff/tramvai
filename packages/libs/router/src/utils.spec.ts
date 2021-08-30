/**
 * @jest-environment jsdom
 */
import { parse } from '@tinkoff/url';
import { isSameHost, normalizeTrailingSlash, normalizeManySlashes } from './utils';

describe('router/utils', () => {
  describe('normalizeManySlashes', () => {
    it('trailingSlash', () => {
      expect(normalizeTrailingSlash('/')).toBe('/');
      expect(normalizeTrailingSlash('/a/b/c/')).toBe('/a/b/c');
      expect(normalizeTrailingSlash('/a/b/c')).toBe('/a/b/c');

      expect(normalizeTrailingSlash('/', true)).toBe('/');
      expect(normalizeTrailingSlash('/a/b/c/', true)).toBe('/a/b/c/');
      expect(normalizeTrailingSlash('/a/b/c', true)).toBe('/a/b/c/');
      expect(normalizeTrailingSlash('/a/b.d/c', true)).toBe('/a/b.d/c/');
    });

    it('normalizeManySlashes', () => {
      expect(normalizeManySlashes('//')).toBe('/');
      expect(normalizeManySlashes('/a///b/c')).toBe('/a/b/c');
      expect(normalizeManySlashes('//a/b')).toBe('/a/b');
      expect(normalizeManySlashes('//a/b')).toBe('/a/b');
      expect(normalizeManySlashes('http://localhost:3000//')).toBe('http://localhost:3000/');
      expect(normalizeManySlashes('http://localhost:3000//////')).toBe('http://localhost:3000/');
      expect(normalizeManySlashes('http://localhost:3000/a///bbb')).toBe(
        'http://localhost:3000/a/bbb'
      );
    });
  });

  it('isSameHost', () => {
    expect(isSameHost(parse('http://example.no/test?a=1'))).toBe(false);
    expect(isSameHost(parse('http://localhost/test?a=1'))).toBe(true);
  });
});
