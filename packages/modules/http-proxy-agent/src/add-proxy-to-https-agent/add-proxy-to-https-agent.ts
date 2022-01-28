/* eslint-disable no-param-reassign */
import https from 'https';
import type { AgentOptions } from 'https';
import net from 'net';
import type { Socket } from 'net';
import url from 'url';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { matchNoProxy } from './match-no-proxy';
import { getHttpsProxy, getNoProxy } from '../utils/env';

type Proxy = {
  hostname: string;
  port: number;
  auth?: string;
};

export interface HttpsProxyAgentOptions extends AgentOptions {
  proxy?: Proxy;
  logger: ReturnType<typeof LOGGER_TOKEN>;
}

export interface ConnectOptions {
  protocol: string;
  host: string;
  port: number;
  hostname: string;
  search: string;
  query: string;
  pathname: string;
  path: string;
  href: string;
  method: string;
  headers: Record<string, string[]>;
  socket: Socket;
}

/**
 * Fork of https://github.com/mknj/node-keepalive-proxy-agent with monkeypatching and no_proxy support
 */
export const addProxyToHttpsAgent = ({ logger }: { logger: ReturnType<typeof LOGGER_TOKEN> }) => {
  const httpsProxyEnv = getHttpsProxy();
  const noProxyEnv = getNoProxy();
  const noProxyMatchResults = {};

  if (!httpsProxyEnv) {
    return;
  }

  const parsedProxy = new url.URL(httpsProxyEnv);
  const proxy = { hostname: parsedProxy.hostname, port: parsedProxy.port };

  logger.debug({
    event: 'parsed proxy',
    proxy,
  });

  // @ts-expect-error
  const originalCreateConnection = https.Agent.prototype.createConnection;
  // @ts-expect-error
  https.Agent.prototype.createConnection = createConnection;

  function createConnection(options: ConnectOptions, cb) {
    const { hostname, href, method, headers } = options;
    const connectionMustBeProxied = !noProxyEnv || !matchNoProxyWithCache({ hostname });

    if (connectionMustBeProxied) {
      logger.debug({
        event: 'proxy connection',
        connection: {
          href,
          method,
          headers,
        },
      });

      createConnectionHttpsAfterHttp.call(this, options, cb);
    } else {
      cb(null, originalCreateConnection.call(this, options));
    }
  }

  function createConnectionHttpsAfterHttp(options: ConnectOptions, cb) {
    const proxySocket = net.connect(+proxy.port, proxy.hostname);

    const errorListener = (error) => {
      proxySocket.destroy();
      cb(error);
    };
    proxySocket.once('error', errorListener);

    let response = '';
    const dataListener = (data) => {
      response += data.toString();
      if (!response.endsWith('\r\n\r\n')) {
        // response not completed yet
        return;
      }
      proxySocket.removeListener('error', errorListener);
      proxySocket.removeListener('data', dataListener);

      const m = response.match(/^HTTP\/1.\d (\d*)/);
      if (m == null || m[1] == null) {
        proxySocket.destroy();
        return cb(new Error(response.trim()));
      }
      if (m[1] !== '200') {
        proxySocket.destroy();
        return cb(new Error(m[0]));
      }
      // tell super function to use our proxy socket
      options.socket = proxySocket;
      cb(null, originalCreateConnection.call(this, options));
    };
    proxySocket.on('data', dataListener);

    let host = options.hostname;

    if (!host) {
      host = options.host;
    }

    // https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.6
    let cmd = `CONNECT ${host}:${options.port} HTTP/1.1\r\n`;
    cmd += `Host: ${host}:${options.port}\r\n`;
    cmd += '\r\n';

    proxySocket.write(cmd);
  }

  function matchNoProxyWithCache({ hostname }: { hostname: string }): boolean {
    if (hostname in noProxyMatchResults) {
      return noProxyMatchResults[hostname];
    }

    const noProxy = noProxyEnv;
    const result = matchNoProxy({ noProxy, hostname });

    noProxyMatchResults[hostname] = result;

    return result;
  }
};
/* eslint-enable no-param-reassign */
