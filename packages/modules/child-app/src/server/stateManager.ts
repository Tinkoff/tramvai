import type {
  ChildAppDiManager,
  ChildAppStateManager,
  ChildAppFinalConfig,
} from '@tramvai/tokens-child-app';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { CONTEXT_TOKEN } from '@tramvai/tokens-common';

export class StateManager implements ChildAppStateManager {
  private readonly log: ReturnType<typeof LOGGER_TOKEN>;
  private readonly diManager: ChildAppDiManager;

  state = Object.create(null);

  constructor({
    logger,
    diManager,
  }: {
    logger: typeof LOGGER_TOKEN;
    diManager: ChildAppDiManager;
  }) {
    this.log = logger('child-app:state-manager');
    this.diManager = diManager;
  }

  registerChildApp(config: ChildAppFinalConfig): void {
    const di = this.diManager.getChildDi(config);
    const { key } = config;

    if (!di) {
      return;
    }

    try {
      const context = di.get(CONTEXT_TOKEN);

      this.state[key] = context.dehydrate().dispatcher;
    } catch (error) {
      if (error.code !== 'E_STUB') {
        this.log.error({
          event: 'get-state-failed',
          config,
        });
      }
    }
  }

  getState(): void {
    return this.state;
  }
}
