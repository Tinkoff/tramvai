import { resolve } from 'path';
import Fastify from 'fastify';
import FastifyProxy from '@fastify/http-proxy';
import { start } from '@tramvai/cli';

const portMapping = {
  base: 4041,
  'client-hints': 4042,
  commandline: 4043,
  error: 4044,
  header: 4045,
  'react-query': 4046,
  router: 4047,
  state: 4048,
};

const cliStarts: Array<ReturnType<typeof start>> = [];

const server = Fastify();

for (const [target, port] of Object.entries(portMapping)) {
  cliStarts.push(
    start({
      target,
      port,
      rootDir: resolve(__dirname, '..'),
      resolveSymlinks: false,
    })
  );

  server.register(FastifyProxy, {
    upstream: `http://localhost:${port}/`,
    prefix: `/${target}`,
    rewritePrefix: `/${target}`,
  });
}

(async () => {
  await Promise.all(cliStarts);

  server.listen({ port: 4040 }, () => {
    console.log('Server listen on port 4040');
  });
})();
