import { createPool } from 'lightning-pool';
import type { Container } from '@tinkoff/dippy';
import type { Worker, WorkerBridge, WorkerBridgeFactory } from './base/types';

const POOL_OPTIONS = {
  minIdle: 1,
  min: 2,
};

export const createWorkerPool = async (
  di: Container,
  workerBridgeFactory: WorkerBridgeFactory<Worker>
) => {
  const workerBridge = workerBridgeFactory(di);
  await workerBridge.setup();

  const pool = createPool(
    {
      create: async () => {
        const worker = await workerBridge.create();

        worker.on('exit', () => {
          pool.destroy(worker);
        });

        return worker;
      },
      destroy: (worker: Worker) => {
        return workerBridge.destroy(worker);
      },
      reset: (worker: Worker) => {
        worker.removeAllListeners('exit');
        return new Promise((resolve, reject) => {
          worker.on('exit', () => {
            reject(new Error('please, destroy it'));
          });

          return workerBridge.destroy(worker);
        });
      },
    },
    POOL_OPTIONS
  );

  const send: WorkerBridge<Worker>['send'] = (worker, type, message) => {
    return workerBridge.send(worker, type, message);
  };

  return {
    pool,
    send,
  };
};
