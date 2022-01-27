import path from 'path';
import type { Worker } from 'cluster';
import cluster from 'cluster';
import { createPool } from 'lightning-pool';
import type { Container } from '@tinkoff/dippy';
import { DEBUG_ARGV, TRACE_ARGV } from '../../../config/constants';
import { SERVER_CONFIG_MANAGER_TOKEN } from '../tokens';
import {
  STDOUT_TOKEN,
  STDERR_TOKEN,
  COMMAND_PARAMETERS_TOKEN,
  CONFIG_ROOT_DIR_TOKEN,
} from '../../../di/tokens';

const POOL_OPTIONS = {
  minIdle: 1,
  min: 2,
};

export const createWorkerPool = (di: Container) => {
  const { env } = di.get(COMMAND_PARAMETERS_TOKEN);
  const configManager = di.get(SERVER_CONFIG_MANAGER_TOKEN);
  const stdout = di.get(STDOUT_TOKEN);
  const stderr = di.get(STDERR_TOKEN);

  cluster.setupMaster({
    // указываем другой файл для работы cluster.fork
    exec: path.resolve(__dirname, './worker.js'),
    execArgv: [].concat(
      configManager.debug ? DEBUG_ARGV : [],
      configManager.trace ? TRACE_ARGV : []
    ),
    // устанавливаем в качестве дебага дефолтный порт мастера, т.к. у нас и так один процесс может работать
    inspectPort: process.debugPort,
    silent: true,
    // @ts-ignore
    cwd: di.get(CONFIG_ROOT_DIR_TOKEN),
  });

  const pool = createPool(
    {
      create: async () => {
        const worker = cluster.fork({
          ...env,
          NODE_ENV: 'development',
          // port=0 позволяет запустить сервер на случайном доступном порту
          // https://nodejs.org/dist/latest-v15.x/docs/api/all.html#cluster_how_it_works
          PORT: `${configManager.port}`,
          PORT_SERVER: `${configManager.port}`,
        });

        worker.process.stdout.pipe(stdout);
        worker.process.stderr.pipe(stderr);

        worker.on('exit', () => {
          pool.destroy(worker);
        });

        return worker;
      },
      destroy: (worker: Worker) => {
        worker.process.kill('SIGKILL');
      },
      reset: (worker: Worker) => {
        if (worker.isConnected) {
          worker.removeAllListeners('exit');

          return new Promise((resolve, reject) => {
            worker.on('exit', () => {
              reject(new Error('please, destroy it'));
            });

            // убивает процесс жёстко
            worker.process.kill('SIGKILL');
          });
        }
      },
    },
    POOL_OPTIONS
  );

  return pool;
};
