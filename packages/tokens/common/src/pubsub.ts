import { createToken } from '@tinkoff/dippy';

/**
 * @description
 * Factory for creating pubsub instances
 */
export const PUBSUB_FACTORY_TOKEN = createToken<() => PubSub>('pubsubFactory');

/**
 * @description
 * Singleton pubsub instance
 */
export const PUBSUB_TOKEN = createToken<PubSub>('pubsub');

/**
 * @description
 * Request pubsub instance that is created for every client
 */
export const ROOT_PUBSUB_TOKEN = createToken<PubSub>('rootPubsub');

export interface PubSub {
  subscribe(event: string, fn: (payload?: any) => void): () => boolean;

  publish(event: string, ...args: unknown[]): any;
}
