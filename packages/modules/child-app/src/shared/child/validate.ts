import type { Provider, TokenType } from '@tinkoff/dippy';
import { ENV_USED_TOKEN } from '@tramvai/tokens-common';

export const validateChildAppProvider = (provider: Provider) => {
  if (provider.provide.name === (ENV_USED_TOKEN as any as TokenType<any>).name) {
    throw new Error(`child-app Cannot use 'ENV_USED_TOKEN' as envs should be controlled by the root-app.
Consider passing configs from the root-app to child-app explicitly and remove defining 'ENV_USED_TOKEN' in the child-app itself.
You can still use 'ENV_MANAGER_TOKEN' in child-app to get env values`);
  }
};
