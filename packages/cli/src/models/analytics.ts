import type { Visitor } from 'universal-analytics';
import ua from 'universal-analytics';
import isString from '@tinkoff/utils/is/string';
import { performance } from 'perf_hooks';

interface Event {
  name: string;
}

interface ActionEvent extends Event {
  category: 'command' | 'task';
  executionTime?: number;
  label?: string;
  parameters?: any;
}

interface ErrorEvent extends Event {
  errorMessage?: string;
  errorStatus?: number;
}

export class Analytics {
  private visitor: Visitor;

  private trackErrorInternal = ({ name, errorMessage, errorStatus }: ErrorEvent, resolve) => {
    this.visitor.event('error', name, errorMessage, errorStatus).send(resolve);
  };

  private trackCommandInternal = (
    { name, executionTime, label, parameters, category }: ActionEvent,
    resolve
  ) => {
    const path = [category, name, label].join('/');
    const event = this.visitor
      .screenview({ cd: path })
      .event(category, name, isString(parameters) ? parameters : JSON.stringify(parameters));
    if (executionTime) {
      event.timing(category, name, Math.floor(executionTime));
    }

    event.send(resolve);
  };

  private trackTimingInternal = ({ name, executionTime, category }: ActionEvent, resolve) => {
    this.visitor.timing(category, name, Math.floor(executionTime)).send(resolve);
  };

  trackError = this.promisify(this.trackErrorInternal);

  // tslint:disable-line member-ordering
  track = this.promisify(this.trackCommandInternal);

  // tslint:disable-line member-ordering
  trackTiming = this.promisify(this.trackTimingInternal);

  constructor({ trackingCode, packageInfo: { name, version } }) {
    this.visitor = ua(trackingCode);

    this.visitor.set('ds', 'app');
    this.visitor.set('an', name);
    this.visitor.set('av', version);
    this.visitor.set('aid', 'tramvai-cli');
  }

  trackAfter(actionEvent: ActionEvent) {
    const startedAt = performance.now();
    const trackingPromise = this.track(actionEvent);
    return async <TResult>(promise: Promise<TResult>): Promise<TResult> => {
      try {
        const result = await promise;
        return Promise.all([
          trackingPromise,
          this.trackTiming({ ...actionEvent, executionTime: performance.now() - startedAt }),
        ]).then(() => result);
      } catch (e) {
        return this.trackError({
          name: actionEvent.name,
          errorMessage: e.name,
          errorStatus: e.status,
        }).then(() => {
          throw e;
        });
      }
    };
  }

  private promisify<TEvent>(func: (event: TEvent, resolve: any, ...args) => void) {
    return function promisifed(event: TEvent, ...args): Promise<void> {
      return new Promise((resolve) => func(event, resolve, ...args));
    };
  }

  // tslint:disable-line member-ordering
}
