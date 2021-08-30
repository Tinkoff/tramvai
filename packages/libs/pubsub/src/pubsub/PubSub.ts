import noop from '@tinkoff/utils/function/noop';
import type { Logger, ResultTransform, Options } from '../types.h';

const mockLogger = {
  debug: noop,
  info: noop,
  error: noop,
};

const defaultOptions = {
  logger: mockLogger,
  resultTransform: (res: any[]) => {
    if (res.length === 1) {
      return res[0];
    }

    return res;
  },
};

export class PubSub<Events extends Record<string, (...args: any[]) => any>> {
  private subscribers: Map<keyof Events, Set<Function>>;

  private logger: Logger;

  private resultTransform: ResultTransform;

  constructor(options?: Options) {
    this.subscribers = new Map();

    const opts = { ...defaultOptions, ...options };
    this.logger = opts.logger;
    this.resultTransform = opts.resultTransform;
  }

  subscribe<Event extends keyof Events>(event: Event, fn: Events[Event]) {
    this.logger.debug('subscribe', event, fn);

    let subs = this.subscribers.get(event);

    if (subs) {
      subs.add(fn);
    } else {
      subs = new Set([fn]);
      this.subscribers.set(event, subs);
    }

    return () => subs!.delete(fn);
  }

  publish<Event extends keyof Events>(event: Event, ...args: Parameters<Events[Event]>) {
    this.logger.debug('publish', event, args);

    const subs = this.subscribers.get(event);

    if (subs && subs.size) {
      const promises: Promise<any>[] = [];

      subs.forEach((sub) => promises.push(Promise.resolve(sub(...args))));

      return Promise.all(promises).then(this.resultTransform);
    }

    return Promise.resolve();
  }
}
