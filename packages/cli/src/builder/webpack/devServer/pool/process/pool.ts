import path from 'path';
import type { Worker } from 'cluster';
import cluster from 'cluster';
import type { WorkerBridgeFactory } from '../base/types';
import { DEBUG_ARGV, TRACE_ARGV } from '../../../../../config/constants';
import { SERVER_CONFIG_MANAGER_TOKEN } from '../../../tokens';
import {
  STDOUT_TOKEN,
  STDERR_TOKEN,
  COMMAND_PARAMETERS_TOKEN,
  CONFIG_ROOT_DIR_TOKEN,
} from '../../../../../di/tokens';

export const ProcessWorkerBridge: WorkerBridgeFactory<Worker> = (di) => {
  const { env } = di.get(COMMAND_PARAMETERS_TOKEN);
  const configManager = di.get(SERVER_CONFIG_MANAGER_TOKEN);
  const stdout = di.get(STDOUT_TOKEN);
  const stderr = di.get(STDERR_TOKEN);
  let firstWorker = true;

  return {
    async setup() {
      cluster.setupPrimary({
        // указываем другой файл для работы cluster.fork
        exec: path.resolve(__dirname, './worker.js'),
        execArgv: ([] as string[]).concat(
          configManager.debug ? DEBUG_ARGV : [],
          configManager.trace ? TRACE_ARGV : []
        ),
        // устанавливаем в качестве дебага дефолтный порт мастера, т.к. у нас и так один процесс может работать
        inspectPort: process.debugPort,
        silent: true,
        // @ts-ignore
        cwd: di.get(CONFIG_ROOT_DIR_TOKEN),
      });
    },
    async create() {
      const worker = cluster.fork({
        ...env,
        NODE_ENV: 'development',
        // port=0 позволяет запустить сервер на случайном доступном порту
        // https://nodejs.org/dist/latest-v15.x/docs/api/all.html#cluster_how_it_works
        PORT: `${configManager.port}`,
        PORT_SERVER: `${configManager.port}`,
        TRAMVAI_CLI_WATCH_INITIAL_BUILD: firstWorker,
      });

      firstWorker = false;

      worker.process.stdout?.pipe(stdout);
      worker.process.stderr?.pipe(stderr);

      return worker;
    },
    async destroy(worker) {
      if (worker.isConnected()) {
        worker.process.kill('SIGKILL');
      }
    },
    async send(worker, type, message) {
      if (type === 'script') {
        const { filename, script } = message;

        worker.send({
          filename,
          script: script.toString('utf-8'),
        });
      }
    },
  };
};
