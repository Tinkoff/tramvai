const http = require('http');
const express = require('express');
const getPort = require('get-port');

const app1 = express();
app1.get('/', (req, res) => res.end('hello1'));
const app2 = express();
app2.get('/', (req, res) => res.end('hello2'));
const app3 = express();
app3.get('/', (req, res) => res.end('hello3'));

const server1 = http.createServer(app1);
const server2 = http.createServer(app2);
const server3 = http.createServer(app3);

const { createTerminus } = require('../..');

createTerminus(server1, app1, {
  onSignal: () => {
    console.log('server1:onSignal');
    return Promise.resolve();
  },
});
createTerminus(server2, app2, {
  onSignal: () => {
    console.log('server2:onSignal');
    return Promise.resolve();
  },
});
createTerminus(server3, app3, {
  onSignal: () => {
    console.log('server3:onSignal');
    return Promise.resolve();
  },
});

// eslint-disable-next-line no-async-promise-executor, promise/catch-or-return
new Promise(async (resolve) => {
  let counter = 3;
  const handle = () => {
    counter -= 1;
    if (counter <= 0) {
      resolve();
    }
  };

  const [port1, port2, port3] = await Promise.all([getPort(), getPort(), getPort()]);

  server1.listen(port1, handle);
  server2.listen(port2, handle);
  server3.listen(port3, handle);
}).then(() => process.kill(process.pid, 'SIGTERM'));
