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
