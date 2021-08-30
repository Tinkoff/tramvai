import { RemoteReporter } from './remote';

describe('log/reporters/remote', () => {
  it('test requestCount behavior', async () => {
    const res = [];
    const makeRequest = jest.fn(() => new Promise((resolve) => res.push(resolve)));

    jest.runAllTimers();

    const remote = new RemoteReporter({
      requestCount: 2,
      makeRequest,
      emitLevels: { info: true, debug: true, error: true, trace: true },
    });

    remote.log({ type: 'info', args: ['a'] } as any);
    remote.log({ type: 'error', args: ['b'] } as any);
    remote.log({ type: 'trace', args: ['c'] } as any);
    remote.log({ type: 'debug', args: ['d'] } as any);

    expect(makeRequest).toHaveBeenCalledWith({ type: 'info', message: 'a' });
    expect(makeRequest).toHaveBeenCalledWith({ type: 'error', message: 'b' });
    expect(makeRequest).toHaveBeenCalledTimes(2);
    await res.shift()();
    await Promise.resolve();
    expect(makeRequest).toHaveBeenCalledWith({ type: 'trace', message: 'c' });
    expect(makeRequest).toHaveBeenCalledTimes(3);
    await res.shift()();
    await Promise.resolve();
    expect(makeRequest).toHaveBeenCalledWith({ type: 'debug', message: 'd' });
    expect(makeRequest).toHaveBeenCalledTimes(4);
    await res.shift()();
    await res.shift()();
    expect(makeRequest).toHaveBeenCalledTimes(4);
  });

  it('test remote option', async () => {
    const res = [];
    const makeRequest = jest.fn(() => new Promise((resolve) => res.push(resolve)));

    jest.runAllTimers();

    const remote = new RemoteReporter({
      makeRequest,
    });

    const logObj: any = { type: 'info', args: ['a'] };

    remote.log(logObj);

    expect(makeRequest).not.toHaveBeenCalled();

    remote.log({ ...logObj, remote: true });

    expect(makeRequest).toHaveBeenCalledWith({ type: 'info', message: 'a' });
    await res.shift()();
    await Promise.resolve();

    remote.log({ ...logObj, remote: true, args: ['b'] });

    expect(makeRequest).toHaveBeenCalledWith({ type: 'info', message: 'b' });
    await res.shift()();
    await Promise.resolve();
  });
});
