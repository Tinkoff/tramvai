import { parentPort } from 'worker_threads';
import { installServerWrapper, requireFromString } from '../base/worker';

installServerWrapper((port) => {
  parentPort.postMessage({ cmd: 'listen', port });
});

parentPort.on('message', ({ filename, script }) => {
  try {
    requireFromString(Buffer.from(script).toString('utf-8'), filename);
  } catch (err) {
    console.error(err);
  }
});
