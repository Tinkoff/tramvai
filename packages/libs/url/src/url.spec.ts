/**
 * @jest-environment jsdom
 */

import {
  parse,
  resolve,
  resolveUrl,
  isAbsoluteUrl,
  getPath,
  fromPath,
  addQuery,
  format,
  isInvalidUrl,
} from './url';

const { location } = window;
delete global.window.location;
global.window.location = { ...location };

let currentLocation = 'http://localhost/';
Object.defineProperty(window.location, 'href', {
  get: () => currentLocation,
  set: (href) => {
    currentLocation = href;
  },
});

describe('url', () => {
  describe('isAbsoluteUrl', () => {
    it('test cases', () => {
      expect(isAbsoluteUrl('http://example.com')).toBe(true); // true - regular http absolute URL
      expect(isAbsoluteUrl('HTTP://EXAMPLE.COM')).toBe(true); // true - HTTP upper-case absolute URL
      expect(isAbsoluteUrl('https://www.exmaple.com')).toBe(true); // true - secure http absolute URL
      expect(isAbsoluteUrl('ftp://example.com/file.txt')).toBe(true); // true - file transfer absolute URL
      expect(isAbsoluteUrl('//cdn.example.com/lib.js')).toBe(true); // true - protocol-relative absolute URL
      expect(isAbsoluteUrl('/myfolder/test.txt')).toBe(false); // false - relative URL
      expect(isAbsoluteUrl('test')).toBe(false); // false - also relative URL
    });
  });

  describe('isInvalidUrl', () => {
    it('test cases', () => {
      expect(isInvalidUrl('/')).toBe(false);
      expect(isInvalidUrl('//')).toBe(true);
      expect(isInvalidUrl('/////')).toBe(true);
      expect(isInvalidUrl('/////?test=123')).toBe(true);
      expect(isInvalidUrl('/////test')).toBe(false);
      expect(isInvalidUrl('http://localhost/')).toBe(false);
      expect(isInvalidUrl('http://localhost///wqwe/wqewqe///?2132')).toBe(false);
    });
  });

  describe('parse', () => {
    it('should parse absolute url', () => {
      expect(parse('//tinkoff.ru')).toMatchObject({
        hash: '',
        host: 'tinkoff.ru',
        hostname: 'tinkoff.ru',
        href: 'http://tinkoff.ru/',
        pathname: '/',
        port: '',
        protocol: 'http:',
        origin: 'http://tinkoff.ru',
        search: '',
        query: {},
      });
      expect(parse('https://tinkoff.ru:8080/login?redirect=/test&a=b&c=3#abc')).toMatchObject({
        hash: '#abc',
        host: 'tinkoff.ru:8080',
        hostname: 'tinkoff.ru',
        href: 'https://tinkoff.ru:8080/login?redirect=/test&a=b&c=3#abc',
        pathname: '/login',
        port: '8080',
        protocol: 'https:',
        origin: 'https://tinkoff.ru:8080',
        search: '?redirect=/test&a=b&c=3',
        query: {
          redirect: '/test',
          a: 'b',
          c: '3',
        },
      });
    });

    it('should parse relative urls', () => {
      expect(parse('.././test/123?d=/abc&c=3&c=4')).toMatchObject({
        hash: '',
        href: '/test/123?d=/abc&c=3&c=4',
        pathname: '/test/123',
        port: '',
        protocol: 'http:',
        search: '?d=/abc&c=3&c=4',
        query: {
          d: '/abc',
          c: ['3', '4'],
        },
      });
      expect(parse('/root/path/1/2/3#test')).toMatchObject({
        hash: '#test',
        href: '/root/path/1/2/3#test',
        pathname: '/root/path/1/2/3',
        port: '',
        protocol: 'http:',
        search: '',
        query: {},
      });
    });

    it('should parse invalid urls', () => {
      expect(parse('//')).toMatchObject({
        href: '/',
      });
      expect(parse('////?test=123')).toMatchObject({
        href: '/?test=123',
      });
    });
  });

  describe('resolve', () => {
    it('should resolve url', () => {
      expect(resolve('//tinkoff.ru', './test123')).toBe('http://tinkoff.ru/test123');
      expect(resolve('//tinkoff.ru/a/b/c/', '../../test')).toBe('http://tinkoff.ru/a/test');
      expect(resolve('https://tinkoff.ru/a/b/c/?test=123#abc', '.././test/?me=123#123')).toBe(
        'https://tinkoff.ru/a/b/test/?me=123#123'
      );
      expect(resolve('/test/', './search/?a=1&b=2#hash')).toMatchInlineSnapshot(
        `"/test/search/?a=1&b=2#hash"`
      );
    });
  });

  describe('resolveUrl', () => {
    it('should resolve url', () => {
      expect(resolveUrl('', 'https://tinkoff.ru/eng/media/')).toMatchObject({
        href: 'https://tinkoff.ru/eng/media/',
      });
      expect(resolveUrl('//tinkoff.ru', './test')).toMatchObject({
        href: 'http://tinkoff.ru/test',
      });
    });
  });

  describe('getPath', () => {
    it('should return path from URL', () => {
      expect(getPath(parse('/test/123/'))).toBe('/test/123/');
      expect(getPath(parse('/test/?a=1&b=2&b=3'))).toBe('/test/?a=1&b=2&b=3');
      expect(getPath(parse('/test/?c=3&d=4#hash'))).toBe('/test/?c=3&d=4#hash');
    });
  });

  describe('fromPath', () => {
    it('should return undefined if cannot parse', () => {
      expect(fromPath('')).toBeUndefined();
      expect(fromPath(null)).toBeUndefined();
      expect(fromPath('AAAAA')).toBeUndefined();
    });

    it('should return object if parse is success', () => {
      expect(fromPath('/')).toMatchInlineSnapshot(`
        Object {
          "hash": "",
          "pathname": "/",
          "search": "",
        }
      `);
      expect(fromPath('/test/?a=1&b=2#hash')).toMatchInlineSnapshot(`
        Object {
          "hash": "",
          "pathname": "/test/",
          "search": "?a=1&b=2#hash",
        }
      `);
    });
  });

  describe('addQuery', () => {
    it('should add query parameters for url', () => {
      expect(addQuery('/test/mine?a=1&a=2&b=3#abc', { c: '4', d: '5', a: ['6', '7'] })).toEqual({
        hash: '#abc',
        href: '/test/mine?b=3&c=4&d=5&a=6&a=7#abc',
        pathname: '/test/mine',
        path: '/test/mine?b=3&c=4&d=5&a=6&a=7#abc',
        port: '',
        origin: 'http://localhost',
        protocol: 'http:',
        search: '?b=3&c=4&d=5&a=6&a=7',
        username: '',
        password: '',
        query: {
          a: ['6', '7'],
          b: '3',
          c: '4',
          d: '5',
        },
      });
    });

    it('should omit query with undefined value', () => {
      expect(addQuery('/test/?a=1&b=2&c=3', { a: undefined })).toEqual({
        hash: '',
        href: '/test/?b=2&c=3',
        pathname: '/test/',
        path: '/test/?b=2&c=3',
        port: '',
        origin: 'http://localhost',
        protocol: 'http:',
        search: '?b=2&c=3',
        username: '',
        password: '',
        query: {
          b: '2',
          c: '3',
        },
      });
    });
  });

  describe('format', () => {
    it('test', () => {
      expect(format({ host: 'tinkoff.ru', protocol: 'https' })).toBe('https://tinkoff.ru/');
      expect(format({ host: 'tinkoff.ru', pathname: 'test/a/', search: 'a=1&b=2' })).toBe(
        'http://tinkoff.ru/test/a/?a=1&b=2'
      );
      expect(
        format({ pathname: 'b', port: '3000', query: { a: '23', b: '18', c: ['15', '16'] } })
      ).toBe('http://localhost:3000/b?a=23&b=18&c=15&c=16');
      expect(
        format({ path: '/main/?a=тест1&b=тест2', host: 'tinkoff.ru:5000' })
      ).toMatchInlineSnapshot(
        `"http://tinkoff.ru:5000/main/?a=%D1%82%D0%B5%D1%81%D1%821&b=%D1%82%D0%B5%D1%81%D1%822"`
      );
      expect(format({ host: 'tinkoff.ru', port: '', path: '/test/?a=123' })).toEqual(
        'http://tinkoff.ru/test/?a=123'
      );
    });

    it('format(parse(url)) should be equal to initial url', () => {
      const url = 'http://tinkoff.ru/test?a=1&b=2';

      expect(format(parse(url))).toBe(url);
    });

    it('should format urls with wrong path', () => {
      expect(
        format({ host: 'localhost', protocol: 'http', path: '//business//corp-card////' })
      ).toEqual('//business//corp-card////');

      expect(
        format({ host: 'localhost', protocol: 'http', path: '/////business//account////' })
      ).toEqual('/////business//account////');
    });

    it('should reset port is setted to empty string', () => {
      currentLocation = 'http://localhost:3000';

      expect(format({ protocol: 'https', host: 'tinkoff.ru', path: '/test/', port: '' })).toEqual(
        'https://tinkoff.ru/test/'
      );
    });

    it('port sets to 0 in some browsers', () => {
      expect(format({ protocol: 'https', host: 'tinkoff.ru', path: '/test/', port: '0' })).toEqual(
        'https://tinkoff.ru/test/'
      );
    });
  });
});
