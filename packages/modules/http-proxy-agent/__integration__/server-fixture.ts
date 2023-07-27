import type { WorkerFixture } from '@playwright/test';
import net from 'net';
import http from 'http';
import https from 'https';
import { getPort } from '@tramvai/internal-test-utils/utils/getPort';
import { getKeys } from '@tramvai/internal-test-utils/utils/keys';
import { mapHostsToLocalIP } from './utils/dns';

mapHostsToLocalIP(['proxied.mylocalhost.com', 'non-proxied.mylocalhost.com']);

export interface ApiServer {
  getPort: () => number;
  getUrls: () => string[];
  clearUrls: () => void;
}

export const apiServerFixture: [
  WorkerFixture<ApiServer, {}>,
  { scope: 'worker'; timeout: number }
] = [
  // eslint-disable-next-line no-empty-pattern
  async ({}, use) => {
    // default port, used when our fake dns lookup will return 127.0.0.1 IP - we can't specify port there
    const port = 443;
    let urls: string[] = [];

    const server = https.createServer(await getKeys(), (req, res) => {
      urls.push(req.url!);
      res.write('Ok');
      res.end();
    });

    server.listen(port);

    await use({
      getPort: () => port,
      getUrls: () => urls,
      clearUrls: () => {
        urls = [];
      },
    });

    server.close();
  },
  { scope: 'worker', timeout: 60000 },
];

export interface ProxyServer {
  getPort: () => number;
  getUrls: () => string[];
  clearUrls: () => void;
}

export const proxyServerFixture: [
  WorkerFixture<ProxyServer, { apiServer: ApiServer }>,
  { scope: 'worker'; timeout: number }
] = [
  // eslint-disable-next-line no-empty-pattern
  async ({}, use) => {
    const port = await getPort();
    const proxyServer = http.createServer();
    let urls: string[] = [];

    // reference - https://github.com/imhazige/node-http-connect-proxy/blob/master/server.js
    proxyServer.on('connect', (req, socket, head) => {
      urls.push(req.url!);

      // URL is in the form 'hostname:port'
      const parts = req.url!.split(':', 2);
      // open a TCP connection to the remote host
      const connection = net.connect(+parts[1], parts[0], () => {
        // respond to the client that the connection was made
        socket.write('HTTP/1.1 200 OK\r\n\r\n');

        // create a tunnel between the two hosts
        socket.on('data', (data) => {
          if (connection.writable) {
            connection.write(data);
          }
        });
        socket.on('end', () => {
          connection.end();
        });
        connection.on('data', (data) => {
          if (socket.writable) {
            socket.write(data);
          }
        });
        connection.on('end', () => {
          socket.end();
        });
      });
    });

    proxyServer.listen(port);

    await use({
      getPort: () => port,
      getUrls: () => urls,
      clearUrls: () => {
        urls = [];
      },
    });

    proxyServer.close();
  },
  { scope: 'worker', timeout: 60000 },
];
