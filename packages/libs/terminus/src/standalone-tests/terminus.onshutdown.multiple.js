const http = require('http');
const express = require('express');
const getPort = require('get-port');

(async () => {
  const port = process.argv[2] || (await getPort());
  const app = express();
  app.get('/', (req, res) => res.end('hello'));

  const server = http.createServer(app);

  const { createTerminus } = require('../..');

  const SIGNALS = ['SIGUSR2', 'SIGINT', 'SIGTERM'];
  const SIGNAL = process.argv[2];

  createTerminus(server, app, {
    signals: SIGNALS,
    onSignal: () => {
      console.log(`on-${SIGNAL.toLowerCase()}-runs`);
      return Promise.resolve();
    },
    onShutdown: () => {
      console.log('on-shutdown-runs');
    },
  });

  server.listen(port, () => {
    process.kill(process.pid, SIGNAL);
  });
})();
