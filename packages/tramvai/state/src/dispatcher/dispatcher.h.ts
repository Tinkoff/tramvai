import type { Event } from '../createEvent/createEvent.h';

export type Dispatch = <Payload>(event: Event<Payload>) => Payload;

export interface MiddlewareApi {
  dispatch: Dispatch;
  subscribe(handler: () => void): () => void;
  getState(): Record<string, any>;
}

export type Middleware = (api: MiddlewareApi) => (next: Dispatch) => (event: Event) => any;
