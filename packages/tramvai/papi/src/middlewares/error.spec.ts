import { error } from './error';

describe('error', () => {
  it('works', async () => {
    const errorMock = jest.fn();
    const logger = () => ({
      error: errorMock,
    });
    const create = error({ logger }) as any;
    const papi = {
      path: '/test/',
      method: 'post',
    };
    const middleware = create(papi);

    const err = new Error('test');
    const req = {};
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await middleware(err, req, res, next);

    expect(errorMock).toHaveBeenCalledWith({
      error: err,
      event: 'papiError',
      path: papi.path,
      method: papi.method,
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      resultCode: 'INTERNAL_ERROR',
      errorMessage: 'internal error',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
