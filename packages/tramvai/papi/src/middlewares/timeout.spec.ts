import { timeout } from './timeout';

jest.mock('connect-timeout', () => {
  return (timeoutValue) => timeoutValue;
});

describe('timeout', () => {
  it('uses default timeout', () => {
    const create = timeout() as any;
    const middleware = create({ options: {} });

    expect(middleware).toEqual('10s');
  });

  it('uses options timeout', () => {
    const create = timeout({
      timeout: '500ms',
    }) as any;
    const middleware = create({ options: {} });

    expect(middleware).toEqual('500ms');
  });

  it('uses route timeout', () => {
    const create = timeout({
      timeout: '500ms',
    }) as any;
    const middleware = create({
      options: {
        timeout: '200ms',
      },
    });

    expect(middleware).toEqual('200ms');
  });
});
