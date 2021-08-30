import express from 'express';
import React from 'react';
import { createServer } from 'http';
import { renderToString } from 'react-dom/server';
import { appConfig } from '@tramvai/cli/lib/external/config';
import App from './App';

const bundlesMap = {
  main: () => import('./bundles/main'),
  first: () => import('./bundles/first'),
  second: () => import('./bundles/second'),
  third: () => import('./bundles/third'),
};

const app = express();

app.get('/', async (req, res) => {
  const content = renderToString(<App />);

  if (req.query.bundle) {
    try {
      const { default: name } = await bundlesMap[req.query.bundle as string]().catch((err) => {
        throw err;
      });

      console.log(`loaded bundle ${name}`);
    } catch (_) {
      res.status(500);
      res.end();
      return;
    }
  }

  res.end(`<html>
    <head>
      <link rel="stylesheet" href="http://localhost:${appConfig.staticPort}/dist/client/platform.css">
      <script src="http://localhost:${appConfig.staticPort}/dist/client/hmr.js" defer></script>
      <script src="http://localhost:${appConfig.staticPort}/dist/client/platform.js" defer></script>
    </head>
    <div id="root">${content}</div>
  </html>`);
});

const port = +process.env.PORT ?? 3000;
const server = createServer(app);

server.listen(port, () => {
  console.log(`start server in ${port} port`);
  console.log('server address', server.address());
});
