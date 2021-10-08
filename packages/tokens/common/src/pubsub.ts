import { createToken } from '@tinkoff/dippy';

/**
 * @description
 * Фабрика для создания инстанса pubsub
 */
export const PUBSUB_FACTORY_TOKEN = createToken<() => PubSub>('pubsubFactory');

/**
 * @description
 * Глобальный инстанс pubsub который живет все время
 */
export const PUBSUB_TOKEN = createToken<PubSub>('pubsub');

/**
 * @description
 * Инстанс pubsub который создается для каждого клиента
 */
export const ROOT_PUBSUB_TOKEN = createToken<PubSub>('rootPubsub');

export interface PubSub {
  subscribe(event: string, fn: (payload?: any) => void): () => boolean;

  publish(event: string, ...args: unknown[]): any;
}
