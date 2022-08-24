import { parseProxy } from './parse-proxy';

describe('parse-proxy', () => {
  it('proxy without port', () => {
    const httpsProxyEnv = 'http://domain.com';

    expect(parseProxy(httpsProxyEnv)).toEqual({
      hostname: 'domain.com',
      port: '80',
    });
  });

  it('proxy with default 80 port', () => {
    const httpsProxyEnv = 'http://domain.com:80';

    expect(parseProxy(httpsProxyEnv)).toEqual({
      hostname: 'domain.com',
      port: '80',
    });
  });

  it('proxy with any other port', () => {
    const httpsProxyEnv = 'http://domain.com:4000';

    expect(parseProxy(httpsProxyEnv)).toEqual({
      hostname: 'domain.com',
      port: '4000',
    });
  });
});
