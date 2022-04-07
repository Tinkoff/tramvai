const http = require('http');
const express = require('express');
const getPort = require('get-port');

(async () => {
  const port = process.argv[2] || (await getPort());
  const app = express();
  app.get('/', (req, res) => res.end('hello'));

  const server = http.createServer(app);

  const { createTerminus } = require('../..');

  createTerminus(server, app, {
    onSignal: () => {
      console.log('on-sigterm-runs');
      return Promise.resolve();
    },
  });

  server.listen(port, () => {
    process.kill(process.pid, 'SIGTERM');
  });
})();
