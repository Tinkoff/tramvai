import type { Container } from '@tinkoff/dippy';
import { ChildContainer } from '@tinkoff/dippy';
import type {
  ChildAppDiManager,
  ChildAppLoader,
  ChildAppFinalConfig,
} from '@tramvai/tokens-child-app';
import { getChildProviders } from './child/providers';

export class DiManager implements ChildAppDiManager {
  private appDi: Container;
  private loader: ChildAppLoader;

  private singletonDiManager: ChildAppDiManager;
  private cache = new Map<string, Container>();
  constructor({
    appDi,
    loader,
    singletonDiManager,
  }: {
    appDi: Container;
    loader: ChildAppLoader;
    singletonDiManager: ChildAppDiManager;
  }) {
    this.appDi = appDi;
    this.loader = loader;
    this.singletonDiManager = singletonDiManager;
  }

  getChildDi(config: ChildAppFinalConfig) {
    const { key } = config;

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const di = this.resolveDi(config);

    di && this.cache.set(key, di);

    return di;
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

    const singletonDi = this.singletonDiManager.getChildDi(config);

    if (!singletonDi) {
      return;
    }

    const di = new ChildContainer(singletonDi, this.appDi);

    // add providers on the Request Level to make it possible to reuse providers from the root-app ChildContainer
    const childProviders = getChildProviders(this.appDi);

    childProviders.forEach((provider) => {
      di.register(provider);
    });

    return di;
  }
}
