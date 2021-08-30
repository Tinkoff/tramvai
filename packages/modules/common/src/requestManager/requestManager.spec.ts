import { createRequest } from 'node-mocks-http';
import { RequestManager } from './requestManager';

const createRequestManager = (request: Record<string, any>) => {
  return new RequestManager({
    request: createRequest(request),
  });
};

describe('requestManager', () => {
  describe('getIpFromRequest', () => {
    it('gets IP from X-Real-IP header', () => {
      const requestManager = createRequestManager({
        headers: {
          'x-real-ip': '172.0.0.1',
        },
        connection: {
          remoteAddress: '192.168.0.1',
        },
      });

      expect(requestManager.getClientIp()).toBe('172.0.0.1');
    });

    it('gets IP from connection.remoteAddress otherwise', () => {
      const requestManager = createRequestManager({
        connection: {
          remoteAddress: '192.168.0.1',
        },
      });
      expect(requestManager.getClientIp()).toBe('192.168.0.1');
    });

    it('returns empty string if request object has no required data', () => {
      expect(createRequestManager({}).getClientIp()).toBe('');
      expect(createRequestManager({ connection: {} }).getClientIp()).toBe('');
    });
  });

  it('getHeaders', () => {
    const requestManager = createRequestManager({
      headers: {
        a: '123',
        b: '456',
        c: null,
      },
    });

    expect(requestManager.getHeaders()).toEqual({
      a: '123',
      b: '456',
      c: null,
    });
    expect(requestManager.getHeader('a')).toBe('123');
    expect(requestManager.getHeader('b')).toBe('456');
    expect(requestManager.getHeader('c')).toBe(null);
    expect(requestManager.getHeader('d')).toBeUndefined();
  });

  it('getUrl', () => {
    const requestManager = createRequestManager({
      protocol: 'https://',
      originalUrl: '/abc/',
      headers: {
        host: 'www.test.test',
      },
    });

    expect(requestManager.getUrl()).toBe('https://www.test.test/abc/');
  });

  it('getUrl with x-original-host', () => {
    const requestManager = createRequestManager({
      protocol: 'https://',
      originalUrl: '/abc/',
      headers: {
        host: 'www.test.test',
        'x-original-host': 'www.tinkoff.ru',
      },
    });

    expect(requestManager.getUrl()).toBe('https://www.tinkoff.ru/abc/');
  });

  it('getHost', () => {
    const requestManager = createRequestManager({
      headers: {
        host: 'www.test.test',
      },
    });

    expect(requestManager.getHost()).toBe('www.test.test');
  });
  it('getHost with x-original-host', () => {
    const requestManager = createRequestManager({
      headers: {
        host: 'www.test.test',
        'x-original-host': 'www.tinkoff.ru',
      },
    });

    expect(requestManager.getHost()).toBe('www.tinkoff.ru');
  });
});
