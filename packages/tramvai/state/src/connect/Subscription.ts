import type { EventEmitter } from 'events';
import type { StoreInstance } from '../typings';

// encapsulates the subscription logic for connecting a component to the redux store, as
// well as nesting subscriptions of descendant components, so that we can ensure the
// ancestor components re-render before descendants
export class Subscription {
  stores: EventEmitter[];

  unsubscribe?: Array<() => void>;

  constructor(stores: StoreInstance[]) {
    this.stores = stores;
    this.unsubscribe = undefined;
  }

  onStateChange?: () => void;

  handleStateChange = () => {
    this.onStateChange && this.onStateChange();
  };

  isSubscribed() {
    return Boolean(this.unsubscribe);
  }

  setOnStateChange(onStateChange: () => void) {
    this.onStateChange = onStateChange;
  }

  trySubscribe() {
    if (!this.unsubscribe) {
      this.unsubscribe = this.stores.filter(Boolean).map((store) => {
        store.on('change', this.handleStateChange);

        return () => {
          store.removeListener('change', this.handleStateChange);
        };
      });
    }
  }

  tryUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe.forEach((f) => f());
      this.unsubscribe = undefined;
    }

    this.onStateChange = undefined;
  }
}
