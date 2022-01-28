export const httpProxyEnabled = (): boolean => {
  const { http_proxy, HTTP_PROXY, https_proxy, HTTPS_PROXY, no_proxy, NO_PROXY } = process.env;

  return !!(http_proxy || HTTP_PROXY || https_proxy || HTTPS_PROXY || no_proxy || NO_PROXY);
};

export const getHttpsProxy = (): string => {
  const { https_proxy, HTTPS_PROXY } = process.env;

  return https_proxy || HTTPS_PROXY || '';
};

export const getNoProxy = (): string => {
  const { no_proxy, NO_PROXY } = process.env;

  return no_proxy || NO_PROXY || '';
};
