import flatten from '@tinkoff/utils/array/flatten';
import { Container } from '@tinkoff/dippy';
import { getModuleParameters, walkOfModules } from '@tramvai/core';
import type {
  ChildAppDiManager,
  ChildAppFinalConfig,
  ChildAppLoader,
} from '@tramvai/tokens-child-app';
import { IS_CHILD_APP_DI_TOKEN } from '@tramvai/tokens-child-app';
import { CHILD_APP_INTERNAL_ROOT_DI_BORROW_TOKEN } from '@tramvai/tokens-child-app';
import { CHILD_APP_INTERNAL_ACTION_TOKEN } from '@tramvai/tokens-child-app';
import { CHILD_APP_INTERNAL_CONFIG_TOKEN } from '@tramvai/tokens-child-app';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { getChildProviders } from './child/singletonProviders';
import { commonModuleStubs } from './child/stubs';

export class SingletonDiManager implements ChildAppDiManager {
  private readonly log: ReturnType<typeof LOGGER_TOKEN>;
  private appDi: Container;
  private loader: ChildAppLoader;
  private cache = new Map<string, Container>();
  constructor({
    logger,
    appDi,
    loader,
  }: {
    logger: typeof LOGGER_TOKEN;
    appDi: Container;
    loader: ChildAppLoader;
  }) {
    this.log = logger('child-app:singleton-di-manager');
    this.appDi = appDi;
    this.loader = loader;
  }

  getChildDi(config: ChildAppFinalConfig) {
    const { key, tag } = config;

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    try {
      const di = this.resolveDi(config);

      if (di && tag !== 'debug') {
        this.cache.set(key, di);
      }

      return di;
    } catch (error) {
      this.log.error({
        event: 'resolve-di-fail',
        error,
        config,
      });
      return null;
    }
  }

  forEachChildDi(cb: (di: Container) => void) {
    this.cache.forEach((di) => {
      cb(di);
    });
  }

  private resolveDi(config: ChildAppFinalConfig) {
    const children = this.loader.get(config);

    if (!children) {
      return;
    }

    const di = new Container(
      [
        {
          provide: CHILD_APP_INTERNAL_CONFIG_TOKEN,
          useValue: config,
        },
        {
          provide: IS_CHILD_APP_DI_TOKEN,
          useValue: true,
        },
      ],
      this.appDi
    );

    const { modules = [], providers = [], actions = [] } = children;
    const childProviders = getChildProviders(this.appDi);

    childProviders.forEach((provider) => {
      di.register(provider);
    });

    const resolvedModules = walkOfModules(modules);

    resolvedModules.forEach((mod) => {
      const moduleParameters = getModuleParameters(mod);

      moduleParameters.providers.forEach((provider) => {
        di.register(provider);
      });
    });

    providers.forEach((provider) => {
      di.register(provider);
    });

    di.register({
      provide: CHILD_APP_INTERNAL_ACTION_TOKEN,
      multi: true,
      useValue: actions,
    });

    const borrowTokens = di.get({ token: CHILD_APP_INTERNAL_ROOT_DI_BORROW_TOKEN, optional: true });

    if (borrowTokens) {
      flatten(borrowTokens).forEach((token) => {
        di.borrowToken(this.appDi, token);
      });
    }

    commonModuleStubs.forEach((stub) => {
      if (!di.has(stub.provide)) {
        di.register(stub);
      }
    });

    return di;
  }
}
