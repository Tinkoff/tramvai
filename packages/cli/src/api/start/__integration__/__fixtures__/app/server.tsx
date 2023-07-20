import mapObj from '@tinkoff/utils/object/map';
import fastify from 'fastify';
import { renderToString } from 'react-dom/server';
import { appConfig } from '@tramvai/cli/lib/external/config';
import browserslistConfig from '@tramvai/cli/lib/external/browserslist-normalized-file-config';
import Api from '@tramvai/cli/lib/external/api';
import Pages from '@tramvai/cli/lib/external/pages';
import App from './App';

const bundlesMap = {
  main: () => import('./bundles/main'),
  first: () => import('./bundles/first'),
  second: () => import('./bundles/second'),
  third: () => import('./bundles/third'),
};

const app = fastify({});

interface Querystring {
  bundle?: keyof typeof bundlesMap;
}

app.get<{ Querystring: Querystring }>(
  '/',
  {
    schema: {
      querystring: {
        bundle: { type: 'string' },
      },
    },
  },
  async (request, reply) => {
    const content = renderToString(<App />);

    if (request.query.bundle) {
      try {
        const { default: name } = await bundlesMap[request.query.bundle]().catch((err) => {
          throw err;
        });

        console.log(`loaded bundle ${name}`);
      } catch (_) {
        reply.status(500);
        return '';
      }
    }

    reply.type('text/html');

    return `<html>
    <head>
      <link rel="stylesheet" href="http://localhost:${appConfig.staticPort}/dist/client/platform.css">
      <script src="http://localhost:${appConfig.staticPort}/dist/client/react.js" defer></script>
      <script src="http://localhost:${appConfig.staticPort}/dist/client/hmr.js" defer></script>
      <script src="http://localhost:${appConfig.staticPort}/dist/client/platform.js" defer></script>
    </head>
    <div id="root">${content}</div>
  </html>`;
  }
);

app.get('/virtual/app-config', async () => {
  return appConfig;
});

app.get('/virtual/browserslist-config', async () => {
  return browserslistConfig;
});

app.get('/virtual/api', async () => {
  return mapObj((value) => {
    return typeof value.default;
  }, Api);
});

app.get('/virtual/pages', async () => {
  return Pages;
});

const port = +(process.env.PORT ?? 3000);

app.listen(port).then((address) => {
  console.log(`start server in ${port} port`);
  console.log('server address', address);
});
