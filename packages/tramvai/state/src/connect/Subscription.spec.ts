import { BaseStore } from '../stores/BaseStore';
import { Subscription } from './Subscription';

class StoreA extends BaseStore<any> {
  static storeName = 'aStore';

  state = {
    a: 'A',
  };
}

class StoreB extends BaseStore<any> {
  static storeName = 'bStore';

  state = {
    b: 'B',
  };
}

let storeA;
let storeB;
let handler;
let sub;

describe('state-management/Subscription', () => {
  beforeEach(() => {
    storeA = new StoreA();
    storeB = new StoreB();
    handler = jest.fn();
    sub = new Subscription([storeA, storeB]);
    sub.setOnStateChange(handler);
  });

  it('should be initialized', () => {
    expect(sub.onStateChange).toBe(handler);
    expect(sub.unsubscribe).toBeUndefined();
  });

  it('if not subscribed should not call onStateChange', () => {
    storeA.setState({ a: 'AAA' });

    expect(sub.isSubscribed()).toBeFalsy();
    expect(handler).not.toHaveBeenCalled();
  });

  it('should call onStateChange if subscribed', () => {
    sub.trySubscribe();
    expect(sub.isSubscribed()).toBeTruthy();

    storeA.setState({ a: 'AAA' });
    expect(handler).toHaveBeenCalledTimes(1);

    storeB.setState({ b: 'BBB' });
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('allow unsubscribe', () => {
    sub.trySubscribe();
    expect(sub.isSubscribed()).toBeTruthy();

    storeA.setState({ a: 'AAA' });
    expect(handler).toHaveBeenCalledTimes(1);

    sub.tryUnsubscribe();
    storeB.setState({ b: 'BBB' });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('stores may be optional', () => {
    expect(() => {
      const subscription = new Subscription([storeA, null, storeB]);

      subscription.trySubscribe();
      subscription.tryUnsubscribe();
    }).not.toThrow();
  });
});
