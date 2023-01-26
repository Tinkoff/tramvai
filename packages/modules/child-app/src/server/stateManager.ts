import type { ExtractTokenType } from '@tinkoff/dippy';
import type {
  ChildAppDiManager,
  ChildAppStateManager,
  ChildAppFinalConfig,
} from '@tramvai/tokens-child-app';
import { CHILD_APP_INTERNAL_ROOT_STATE_SUBSCRIPTION_TOKEN } from '@tramvai/tokens-child-app';
import type { LOGGER_TOKEN, STORE_TOKEN } from '@tramvai/tokens-common';
import { CONTEXT_TOKEN } from '@tramvai/tokens-common';
import type { EXTEND_RENDER } from '@tramvai/tokens-render';

export const executeRootStateSubscriptions = ({
  store,
  diManager,
}: {
  store: typeof STORE_TOKEN;
  diManager: ChildAppDiManager;
}): ExtractTokenType<typeof EXTEND_RENDER> => {
  return (render) => {
    const state = store.getState();

    diManager.forEachChildDi((di) => {
      const subscriptions = di.get({
        token: CHILD_APP_INTERNAL_ROOT_STATE_SUBSCRIPTION_TOKEN,
        optional: true,
      }) as unknown as typeof CHILD_APP_INTERNAL_ROOT_STATE_SUBSCRIPTION_TOKEN[];
      subscriptions?.forEach((sub) => {
        sub.listener(state);
      });
    });

    return render;
  };
};

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
    } catch (error: any) {
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
