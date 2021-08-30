import { handler } from './handler';

describe('handler', () => {
  it('works', async () => {
    const result = {
      foo: 'bar',
    };
    const papi = {
      options: {},
      async handler() {
        return result;
      },
    };

    const create = handler() as any;
    const middleware = create(papi);

    const papiState = { a: 1, b: 2 };
    const req = {};
    const res = {
      papiState,
      json: jest.fn(),
    };

    await middleware(req, res);

    expect(res.json).toHaveBeenCalledWith({
      resultCode: 'OK',
      payload: result,
    });
  });

  it('catches an error', async () => {
    const err = new Error('test');
    const papi = {
      async handler() {
        throw err;
      },
    };

    const create = handler() as any;
    const middleware = create(papi);

    const papiState = { a: 1, b: 2 };
    const req = {};
    const res = {
      papiState,
      json: jest.fn(),
    };
    const next = jest.fn();

    await middleware(req, res, next);

    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(err);
  });
});
