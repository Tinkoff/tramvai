/* eslint-disable no-param-reassign */
import dns from 'dns';

export const mapHostsToLocalIP = (hosts: string[]) => {
  const originalLookup = dns.lookup as any;

  // @ts-expect-error
  dns.lookup = function customLookup(hostname: any, ...args: any[]) {
    if (hosts.includes(hostname)) {
      return originalLookup('localhost', ...args);
    }
    return originalLookup(hostname, ...args);
  };
};
/* eslint-enable no-param-reassign */
