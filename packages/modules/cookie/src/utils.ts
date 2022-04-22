import type { USER_AGENT_TOKEN } from '@tramvai/module-client-hints';
import type { CookieOptions } from './tokens';

// ipv4 + IPv4-mapped IPv6 addresses and IPv4-translated addresses
const reIpWithDots = /^(?:::(?:ffff:(0:)?)?)?(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/; // IPv4-Embedded IPv6 Address
const reIpv4Embedded = /^([0-9a-fA-F]{1,4}:){1,4}:(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

export const calculateExpires = (expires?: number | string | Date) => {
  // if expires is number than treat it as seconds
  if (!expires) {
    return;
  }

  return new Date(typeof expires === 'number' ? +new Date() + expires * 1000 : expires);
};

const isIpWithDots = (host: string) => {
  return reIpWithDots.test(host) || reIpv4Embedded.test(host);
};

const trimPort = (host: string) => {
  return host.replace(/:\d+$/, '');
};

export const trimSubdomains = (host: string) => {
  if (isIpWithDots(host)) {
    return host;
  }

  return trimPort(
    host.indexOf('localhost') >= 0 ? host : `.${host.split('.').slice(-2).join('.')}`
  );
};

type PrepareOptions = {
  userAgent: typeof USER_AGENT_TOKEN;
  defaultHost: string;
  secureProtocol: boolean;
};

export const prepareCookieOptions = (
  { userAgent: { sameSiteNoneCompatible }, defaultHost, secureProtocol }: PrepareOptions,
  { sameSite, noSubdomains, ...options }: CookieOptions
) => ({
  ...options,
  ...(sameSite === 'none' && (!sameSiteNoneCompatible || !secureProtocol) ? {} : { sameSite }),
  ...(secureProtocol && sameSite === 'none' && sameSiteNoneCompatible ? { secure: true } : {}),
  expires: calculateExpires(options.expires),
  domain: noSubdomains ? trimSubdomains(options.domain || defaultHost) : options.domain,
});
