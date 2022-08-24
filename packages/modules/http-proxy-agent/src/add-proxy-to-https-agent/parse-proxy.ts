import url from 'url';

export function parseProxy(httpsProxyEnv: string) {
  const parsedProxy = new url.URL(httpsProxyEnv);
  const proxy = { hostname: parsedProxy.hostname, port: parsedProxy.port || '80' };

  return proxy;
}
