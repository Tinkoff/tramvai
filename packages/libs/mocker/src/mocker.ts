import shallowEqual from '@tinkoff/utils/is/shallowEqual';
import omit from '@tinkoff/utils/object/omit';
import type { IncomingMessage, ServerResponse } from 'http';
import { createServer } from 'http';
import querystring from 'querystring';
import type { Request, IRouterMatcher, Express, RequestHandler } from 'express';
import express, { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { Mock, MockConfig, MockerOptions, Logger, ApiConfig } from './mocker.h';
import type { MockRepository } from './repositories/repository.h';

export class Mocker {
  private appRoutePrefix: string;
  private apiRoutePrefix: string;
  private passUnhandledRequests: boolean;
  private repositories: MockRepository[];
  private app: Express;
  private api: Express;

  private apis: Record<string, ApiConfig>;
  private apisRouter: Router;
  private mocksRouters: Record<string, Router>;
  private mocks: Record<string, Record<string, Mock>>;
  private logger: Logger;

  constructor({
    appRoutePrefix,
    apiRoutePrefix,
    apis,
    passUnhandledRequests,
    repositories,
    logger,
  }: MockerOptions) {
    this.logger = logger;
    this.repositories = repositories;
    this.apis = apis;
    this.appRoutePrefix = appRoutePrefix ?? '';
    this.apiRoutePrefix = apiRoutePrefix ?? '';
    this.passUnhandledRequests = passUnhandledRequests ?? false;
  }

  async init() {
    this.app = createApp();
    this.api = createApp();

    await this.update();

    this.applyAppRouter();
    this.applyApiRouter();

    this.app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });
  }

  async update() {
    this.mocks = await this.resolveMocks();

    this.updateRouters();
  }

  setApis(apis: Record<string, ApiConfig>) {
    this.apis = apis;
  }

  addMocks(api: string, mocks: Record<string, Mock>) {
    this.mocks[api] = {
      ...this.mocks[api],
      ...mocks,
    };

    this.updateRouters();
  }

  removeMocks(api: string, mocks: string[]) {
    this.mocks[api] = omit(mocks, this.mocks[api]);

    this.updateRouters();
  }

  use(req: IncomingMessage, res: ServerResponse) {
    return this.app(req, res);
  }

  useApi(req: IncomingMessage, res: ServerResponse) {
    return this.api(req, res);
  }

  async listen(port: number) {
    return new Promise<void>((resolve, reject) => {
      const server = createServer(this.app);

      server.on('error', reject);

      server.listen(port, resolve);
    });
  }

  private updateRouters() {
    this.apisRouter = createRouter();
    this.mocksRouters = this.createMocksRouters();

    this.applyMocksHandlers();
    this.applyApisHandlers();
  }

  private createMocksRouters() {
    const routers: Record<string, Router> = {};

    // create unique routers for all apis
    Object.keys(this.apis).forEach((api) => {
      routers[api] = createRouter();
    });

    return routers;
  }

  // resolve mocks for all apis
  private async resolveMocks() {
    const mocks: Record<string, Record<string, Mock>> = {};

    const repoMocks = await Promise.all(this.repositories.map((repo) => repo.getAll()));

    for (const mock of repoMocks) {
      for (const api in mock) {
        if (api in this.apis) {
          mocks[api] = {
            ...mocks[api],
            ...mock[api],
          };
        }
      }
    }
    return mocks;
  }

  private applyMocksHandlers() {
    Object.keys(this.apis).forEach((api) => {
      const router = this.mocksRouters[api];
      const mocks = this.mocks[api] ?? {};
      const { target } = this.apis[api];
      // create unique proxy for all apis
      const proxy = createProxy({ target });

      // key match pattern "METHOD /api/endpoint?some=queries"
      Object.keys(mocks).forEach((key) => {
        const mock = mocks[key];
        const [method, url] = key.split(' ');
        const [path, query] = url.split('?');
        const adoptedMethod = method.toLowerCase();
        const addRequestHandler = router[adoptedMethod];

        // add unique route for all mocks
        if (isRouterMethod(addRequestHandler)) {
          router[adoptedMethod](path, (req, res, next) => {
            if (typeof mock === 'function') {
              mock(req, res);
            } else {
              let parsedQuery: Record<string, string | string[]>;
              if (query) {
                parsedQuery = parseQuery(query);
              }

              const mockHandler = this.convertMockConfigToHandler(mock, proxy, parsedQuery);
              mockHandler(req, res, next);
            }
          });
        }
      });

      // with "passUnhandledRequests" options proxy every request without a corresponding mock
      if (this.passUnhandledRequests) {
        router.use('/', (req, res, next) => {
          this.logger.debug(`proxy ${req.url}`);
          proxy(req, res, next);
        });
      } else {
        router.use('/', (req, res) => {
          res.status(500).json(`handle request to "${req.url}" - this mock url is not registered`);
        });
      }
    });
  }

  private applyApisHandlers() {
    // apply unique api routers for main router
    Object.keys(this.apis).forEach((api) => {
      const router = this.mocksRouters[api];
      // for nested express application usage, add parent route path
      this.apisRouter.use(`${this.appRoutePrefix}/${api}`, router);
    });

    this.apisRouter.use('/', (req, res) => {
      res.status(500).json(`handle request to "${req.url}" - this api url is not registered`);
    });
  }

  private applyAppRouter() {
    // call this.apisRouter inside function, because it's allow replace this.apisRouter at runtime
    this.app.use((...args) => this.apisRouter(...args));
  }

  private applyApiRouter() {
    this.api.post(`${this.apiRoutePrefix}/mocks`, (req, res) => {
      const { api, mocks } = req.body;

      this.addMocks(api, mocks);

      res.end();
    });

    this.api.delete(`${this.apiRoutePrefix}/mocks`, (req, res) => {
      const { api, mocks } = req.body;

      this.removeMocks(api, mocks);

      res.end();
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private convertMockConfigToHandler(
    mockConfig: MockConfig,
    proxy: RequestHandler,
    query?: Record<string, string | string[]>
  ): RequestHandler {
    const { payload, status, headers = {}, pass } = mockConfig;

    return (req, res, next) => {
      // proxy requests if mock has "pass" options
      if (pass) {
        proxy(req, res, next);
        return;
      }

      // proxy requests if mock and request queries do not match, and "passUnhandledRequests" options is passed
      if (query && Object.keys(query).length > 0) {
        if (!isQueriesEqual(query, req)) {
          if (this.passUnhandledRequests) {
            proxy(req, res, next);
          } else {
            res
              .status(500)
              .json(
                `request to "${
                  req.url
                }" have mock, but queries do not match, mock query is ${JSON.stringify(
                  query
                )}, and request query is ${JSON.stringify(req.query)}`
              );
          }
          return;
        }
      }

      if (status) {
        res.status(status);
      }
      Object.keys(headers).forEach((key) => {
        res.header[key] = headers[key];
      });
      res.json(payload);
    };
  }
}

function isQueriesEqual(query: Record<string, any>, req: Request): boolean {
  return shallowEqual(query, req.query);
}

function parseQuery(query: string): Record<string, string | string[]> {
  return querystring.parse(query);
}

function isRouterMethod(routerMethod: any): routerMethod is IRouterMatcher<any> {
  return typeof routerMethod === 'function';
}

function createRouter() {
  return Router({ mergeParams: true });
}

function createApp() {
  // TODO: replace with fastify
  const app = express();
  return app;
}

function createProxy({ target }: { target: string }) {
  const targetUrl = target.slice(-1) === '/' ? target.slice(0, -1) : target;
  const pathRewrite = (path, req) => {
    // remove parent router path
    return path.replace(req.baseUrl, '');
  };

  return createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite,
  });
}
