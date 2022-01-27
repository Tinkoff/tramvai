import noop from '@tinkoff/utils/function/noop';
import eachObj from '@tinkoff/utils/object/each';
import path from 'path';
import type webpack from 'webpack';
import type Config from 'webpack-chain';
import death from 'death';
import type { Worker } from 'cluster';
import { createProxyServer } from 'http-proxy';
// eslint-disable-next-line no-restricted-imports
import webOutgoing from 'http-proxy/lib/http-proxy/passes/web-outgoing';
import { PoolState } from 'lightning-pool';
import type { Container } from '@tinkoff/dippy';
import type { ConfigManager } from '../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../typings/configEntry/application';
import { createWorkerPool } from './workerPool';
import type { SERVER_TOKEN } from '../../../di/tokens';
import { CLOSE_HANDLER_TOKEN } from '../tokens';

const EXITED_UNEXPECTEDLY = `

!!!  Child process exited unexpectedly  !!!,


See server logs with details and try to fix the issue,
After code change rebuild will be done automatically


`;

declare module 'webpack' {
  export class MultiStats {
    // MultiStats не экспортируется явно из webpack
    stats: webpack.Stats[];
  }
}

const HOOK_NAME = 'DevServer';

export const serverRunner = ({
  di,
  config,
  compiler,
  configManager,
  server,
}: {
  di: Container;
  config: Config;
  compiler: webpack.MultiCompiler;
  configManager: ConfigManager<ApplicationConfigEntry>;
  server: typeof SERVER_TOKEN | null;
}) => {
  if (!server) {
    return noop;
  }
  return async function runDevServer() {
    const file = `${Object.keys(config.entryPoints.entries())[0]}.js`;
    const filename = path.resolve(config.output.get('path'), file);
    // настоящая ссылка на файл используется для отладки в debug режиме
    const realFilename = `http://${configManager.staticHost}:${configManager.staticPort}/${configManager.build.options.outputServer}/${file}`;
    const serverCompiler = compiler.compilers.find((comp) => comp.name === 'server');

    const fs = serverCompiler.outputFileSystem as any;
    const pool = createWorkerPool(di);
    let worker: Worker;
    let serverInvalidated = true;
    let workerPort: number;
    let resolveWorkerPort: () => void;
    let workerPortPromise: Promise<void>;
    let hasExitedUnexpectedly = false;

    const proxy = createProxyServer({
      // указываем, что сами обработаем ответ
      selfHandleResponse: true,
    });

    death({ exit: true, uncaughtException: true })(async (signal, err) => {
      await pool.close(true);

      if (err instanceof Error) {
        console.error(err);
      }

      process.exit(1);
    });

    // отключаем инвалидацию и перезапуск сервера если выставлен флан noServerRebuild
    if (!configManager.noServerRebuild) {
      serverCompiler.hooks.invalid.tap(HOOK_NAME, () => {
        serverInvalidated = true;
        hasExitedUnexpectedly = false;
      });
    }

    const waitWorkerPort = async () => {
      if (workerPort) {
        return workerPort;
      }

      if (workerPortPromise) {
        return workerPortPromise;
      }

      workerPortPromise = new Promise<void>((resolve) => {
        resolveWorkerPort = resolve;
      });

      return workerPortPromise;
    };

    // http-proxy всегда склеивает слеши в урле, что немного неожиданно при работе с сервером напрямую
    // https://github.com/http-party/node-http-proxy/issues/775
    // поэтому пытаемся вернуть все слеши на место
    proxy.on('proxyReq', (proxyReq, req) => {
      // https://github.com/http-party/node-http-proxy/issues/1022#issuecomment-439245479
      // eslint-disable-next-line no-param-reassign
      (proxyReq as any).path = req.url;
    });

    // делаем запросы к дочернему процессу и пытаемся полностью получить его ответ
    // если всё ок, то просто отправляем полученные данные клиенту
    proxy.on('proxyRes', (proxyRes, req, res) => {
      if (!res.headersSent) {
        // дублируем всю логику прокси и отправляем ответ
        // немного костыль по мотивам https://github.com/http-party/node-http-proxy/issues/1263#issuecomment-394758768
        eachObj((handler) => {
          handler(req, res, proxyRes, {});
        }, webOutgoing);
      }

      //
      // Обработка события aborted нужна только для кейса, когда запросы на localhost:4000
      // проксируются через tramvai сервер, который каждый ребилд переоткрывается на другом порту
      //
      // Кейс нужен для __webpack_hmr, который отдает данные в стриме через server-sent events,
      // и нам нужно всегда держать постоянное соединение к __webpack_hmr,
      // а повторное открытие tramvai сервера на другом порту сбрасывает это соединение
      //
      // В proxy.on('error') уже содержится логика по повторному запросу на другой порт,
      // поэтому нам просто нужно обработать обрыв соединения как ошибку
      //
      proxyRes.on('aborted', () => {
        const contentType = res.getHeader('content-type');

        if (typeof contentType === 'string' && contentType.includes('text/event-stream')) {
          proxy.emit('error', Error('aborted'), req, res);
        }
      });

      proxyRes.pipe(res);
    });

    // в случае ошибки ждём пока получим новый порт и делаем повторный запрос
    // рекурсивные ошибки будут опять попадать сюда и это будет продолжаться до тех пор пока не получим ответ
    proxy.on('error', async (err, req, res) => {
      await waitWorkerPort();

      proxy.web(req, res as any, { target: `http://localhost:${workerPort}` });
    });

    // задаём свой http-сервер который будет проксировать запросы к дочернему процессу
    server.on('request', async (req, res) => {
      if (hasExitedUnexpectedly) {
        res.end(EXITED_UNEXPECTEDLY);
        return;
      }

      await waitWorkerPort();

      proxy.web(req, res, { target: `http://localhost:${workerPort}` });
    });

    // Проксируем также и веб-сокеты
    server.on('upgrade', (req, socket, head) => {
      proxy.ws(req, socket, { target: `http://localhost:${workerPort}` });
    });

    di.register({
      provide: CLOSE_HANDLER_TOKEN,
      multi: true,
      useValue: async () => {
        proxy.close();

        if (worker) {
          // если сервер закрывается, мы должны завершить все дочерние воркеры
          await pool.release(worker);
          await pool.close(true);
        }
      },
    });

    serverCompiler.hooks.beforeCompile.tapPromise(HOOK_NAME, async () => {
      if (pool.state === PoolState.IDLE) {
        await pool.start();
      }
    });

    compiler.hooks.done.tap(HOOK_NAME, async (stats) => {
      if (serverInvalidated) {
        workerPort = null;
        workerPortPromise = null;

        serverInvalidated = false;

        if (stats.hasErrors()) {
          // всплыли ошибки при сборке - просто игнорим калбек чтобы не падать ниже и дать возможность выполнить пересборку
          return;
        }

        if (worker) {
          await pool.release(worker);
        }

        worker = await pool.acquire();

        worker.on('exit', async () => {
          hasExitedUnexpectedly = true;
          workerPort = null;
          workerPortPromise = null;

          worker = null;
          pool.release(worker);

          console.error(EXITED_UNEXPECTEDLY);
        });

        worker.once('message', ({ cmd, port }) => {
          if (cmd === 'listen') {
            workerPort = port;

            resolveWorkerPort?.();
          }
        });

        worker.send({
          filename: realFilename,
          script: fs.readFileSync(filename, 'utf8'),
        });
      }
    });
  };
};
