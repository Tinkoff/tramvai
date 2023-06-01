import fs from 'fs';
import path from 'path';
import { getPort } from '@tramvai/internal-test-utils/utils/getPort';
import httpProxy from 'http-proxy';

export const startHttpsProxyServer = async ({
  sourcePort,
  targetPort,
}: {
  sourcePort?: number;
  targetPort: number;
}) => {
  const key = path.join(__dirname, './test-ssl-key.pem');
  const cert = path.join(__dirname, './test-ssl-cert.pem');
  const port = sourcePort ?? getPort();

  // gitlab disallow to commit files with .pem and .key extension
  if (!fs.existsSync(key) || !fs.existsSync(cert)) {
    await Promise.all([
      fs.promises.copyFile(`${key}.tmp`, key),
      fs.promises.copyFile(`${cert}.tmp`, cert),
    ]);
  }

  const proxy = httpProxy.createProxyServer({
    target: {
      host: 'localhost',
      port: targetPort,
    },
    ssl: {
      key: fs.readFileSync(path.join(__dirname, './test-ssl-key.pem'), 'utf8'),
      cert: fs.readFileSync(path.join(__dirname, './test-ssl-cert.pem'), 'utf8'),
    },
  });

  proxy.on('error', (error) => {
    console.error('[https-proxy-error]', error);
  });

  proxy.listen(port);

  return {
    port,
    proxy,
  };
};
