import httpProxy from 'http-proxy';
import { getPort } from '@tramvai/internal-test-utils/utils/getPort';
import { getKeys } from '@tramvai/internal-test-utils/utils/keys';

export const startHttpsProxyServer = async ({
  sourcePort,
  targetPort,
}: {
  sourcePort?: number;
  targetPort: number;
}) => {
  const port = sourcePort ?? getPort();

  const proxy = httpProxy.createProxyServer({
    target: {
      host: 'localhost',
      port: targetPort,
    },
    ssl: await getKeys(),
  });

  proxy.listen(port);

  return {
    port,
    proxy,
  };
};
