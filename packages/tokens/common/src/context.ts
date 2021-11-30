import type { Container } from '@tinkoff/dippy';
import { createToken } from '@tinkoff/dippy';
import type { ConsumerContext as BaseConsumerContext } from '@tramvai/types-actions-state-context';
import type { PUBSUB_TOKEN } from './pubsub';

export { PlatformAction } from '@tramvai/types-actions-state-context';

/**
 * @description
 * Context implementation
 */
export const CONTEXT_TOKEN = createToken<ConsumerContext>('context');

export interface ConsumerContext extends BaseConsumerContext {
  readonly di: Container;
  readonly pubsub: typeof PUBSUB_TOKEN;

  dehydrate: () => {
    dispatcher: {
      stores: Record<string, any>;
    };
  };
}
