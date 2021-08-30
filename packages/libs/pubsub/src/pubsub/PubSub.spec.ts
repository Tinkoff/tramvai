import { PubSub } from './PubSub';

describe('pubsub', () => {
  let ps;
  let f1;
  let f2;
  let f3;

  beforeEach(() => {
    ps = new PubSub();
    f1 = jest.fn();
    f2 = jest.fn();
    f3 = jest.fn();
  });

  it('simple subscribe', () => {
    ps.subscribe('test', f1);
    ps.subscribe('test', f2);
    ps.subscribe('abc', f3);

    ps.publish('test', 'ctr');
    expect(f1).toHaveBeenLastCalledWith('ctr');
    expect(f2).toHaveBeenLastCalledWith('ctr');
    expect(f3).not.toHaveBeenCalled();

    ps.publish('abc', 3);
    expect(f3).toHaveBeenLastCalledWith(3);
    expect(f1).toHaveBeenCalledTimes(1);
    expect(f2).toHaveBeenCalledTimes(1);
  });

  it('wait for publish', async () => {
    ps.subscribe('test', () => 1);
    ps.subscribe('test', () => 2);
    ps.subscribe('test', () => 3);
    ps.subscribe('test2', () => 25);

    expect(await ps.publish('test')).toEqual([1, 2, 3]);
    expect(await ps.publish('test2')).toEqual(25);
  });

  it('wait for publish with `resultTransform` option', async () => {
    const resultTransform = jest.fn((res) => res[0] + res[1]);
    const pubsub = new PubSub({
      resultTransform,
    });

    pubsub.subscribe('test', () => 1);
    pubsub.subscribe('test', () => 2);
    pubsub.subscribe('test', () => 3);

    expect(await pubsub.publish('test')).toEqual(3);
    expect(resultTransform).toHaveBeenCalledWith([1, 2, 3]);
  });

  it('unsubscribe', () => {
    const uns1 = ps.subscribe('test', f1);
    const uns2 = ps.subscribe('test', f2);

    uns1();
    ps.publish('test');
    expect(f1).not.toHaveBeenCalled();
    expect(f2).toHaveBeenCalled();

    uns2();
    ps.publish('test');
    expect(f1).toHaveBeenCalledTimes(0);
    expect(f2).toHaveBeenCalledTimes(1);
  });
});
