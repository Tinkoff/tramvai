import path from 'path';
import { Worker } from 'worker_threads';
import type { WorkerBridgeFactory } from '../base/types';
import { DEBUG_ARGV, TRACE_ARGV } from '../../../../../config/constants';
import { SERVER_CONFIG_MANAGER_TOKEN } from '../../../tokens';
import { COMMAND_PARAMETERS_TOKEN, CONFIG_ROOT_DIR_TOKEN } from '../../../../../di/tokens';

export const ThreadWorkerBridge: WorkerBridgeFactory<Worker> = (di) => {
  const { env } = di.get(COMMAND_PARAMETERS_TOKEN);
  const configManager = di.get(SERVER_CONFIG_MANAGER_TOKEN);
  let firstWorker = true;

  return {
    async setup() {},
    async create() {
      // WARN: potentially dangerous code that will lead to bugs in case of run parallel builds from once process
      // as nodejs do not support this for threads - https://github.com/nodejs/node/issues/41673
      // but it is not a very popular usage anyway
      // Found issues:
      // 1. babel-plugin-lodash will reload configs when the cwd is changed
      // and if this happens between file compilations
      // it'll lead to obscure errors inside this plugin as it won't resolve
      // previously resolved modules and there will be the mess
      // [source code](https://github.com/lodash/babel-plugin-lodash/blob/master/src/config.js#L18)
      // but it currently affects only jest tests probably because of jest's workers usage
      process.chdir(di.get(CONFIG_ROOT_DIR_TOKEN));

      const worker = new Worker(path.resolve(__dirname, './worker.js'), {
        execArgv: [].concat(
          configManager.debug ? DEBUG_ARGV : [],
          configManager.trace ? TRACE_ARGV : []
        ),
        env: {
          ...process.env,
          ...env,
          NODE_ENV: 'development',
          // port=0 позволяет запустить сервер на случайном доступном порту
          // https://nodejs.org/dist/latest-v15.x/docs/api/all.html#cluster_how_it_works
          PORT: `${configManager.port}`,
          PORT_SERVER: `${configManager.port}`,
          TRAMVAI_CLI_WATCH_INITIAL_BUILD: firstWorker,
        },
      });

      firstWorker = false;

      return worker;
    },
    async destroy(worker) {
      await worker.terminate();
    },
    async send(worker, type, message) {
      if (type === 'script') {
        const { filename, script } = message;

        worker.postMessage(
          {
            filename,
            script,
          },
          [script.buffer]
        );
      }
    },
  };
};
