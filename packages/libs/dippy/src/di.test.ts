import { createContainer, createToken } from './di';

describe('di - integrate tests', () => {
  const routeToken = createToken<Route>('route');
  const loggerToken = createToken<Logger>('logger');
  const httpToken = createToken<Http>('http');
  const renderToken = createToken('render');
  const serverToken = createToken('server');
  const flowToken = createToken('flowList', { multi: true });

  const toFn = jest.fn();
  class Route {
    logger: Logger;

    http: Http;

    constructor({ logger, http }) {
      this.logger = logger;
      this.http = http;
    }

    to(url) {
      this.http.get('ads');
      return toFn(url);
    }
  }

  const logFn = jest.fn();
  class Logger {
    log(message) {
      logFn(message);
    }
  }

  const httpFn = jest.fn();
  class Http {
    config: any;

    constructor({ config }) {
      this.config = config;
    }

    get(url) {
      return httpFn(`${this.config.api}${url}`);
    }
  }

  const coreProviders = [
    {
      provide: routeToken,
      useClass: Route,
      deps: { logger: loggerToken, http: httpToken },
    },
    {
      provide: loggerToken,
      useClass: Logger,
    },
    {
      provide: httpToken,
      useClass: Http,
      deps: { logger: loggerToken, config: 'config' },
    },
    {
      provide: 'primitiveBoolean',
      useValue: false,
    },
    {
      provide: 'primitiveString',
      useValue: 'str',
    },
    {
      provide: 'primitiveNumber',
      useValue: 0,
    },
  ];
  const container = createContainer(coreProviders);
  container.register({
    provide: 'config',
    useValue: {
      api: 'api.tinkoff.com',
    },
  });
  container.register({
    provide: renderToken,
    useFactory: ({ route, logger }) => {
      return () => {
        route.to('payments');
        logger.log('render');

        return '<html></html>';
      };
    },
    deps: { route: 'route', logger: loggerToken },
  });
  container.register({
    provide: serverToken,
    useFactory: ({ render }) => {
      render();
    },
    deps: { render: renderToken },
  });

  container.register({
    provide: flowToken,
    useFactory: ({ config }) => {
      return { api: config.api };
    },
    deps: { config: 'config' },
    multi: true,
  });

  container.register({
    provide: flowToken,
    useValue: { api: 'cfg' },
    multi: true,
  });

  it('Получаем инстансы оригинальных классов', () => {
    expect(container.get(routeToken).logger).toBeInstanceOf(Logger);
    expect(container.get(routeToken).http).toBeInstanceOf(Http);
  });

  it('Повторный вызов отдает тот же инстанс', () => {
    const temp1 = container.get(routeToken);
    const temp2 = container.get(routeToken);

    expect(temp1).toBe(temp2);
  });

  it('Проверка цепочки действий', () => {
    container.get(serverToken);
    expect(httpFn).toHaveBeenCalledWith('api.tinkoff.comads');
    expect(toFn).toHaveBeenCalledWith('payments');
    expect(container.get(flowToken)).toEqual([{ api: 'api.tinkoff.com' }, { api: 'cfg' }]);
  });

  it('Проверка получение примитивов', () => {
    expect(container.get('primitiveBoolean')).toBe(false);
    expect(container.get('primitiveString')).toBe('str');
    expect(container.get('primitiveNumber')).toBe(0);
  });
});
