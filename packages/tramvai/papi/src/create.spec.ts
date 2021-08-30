import express from 'express';
import supertest from 'supertest';
import { createPapiMethod } from './createPapiMethod';
import * as middlewares from './middlewares';
import { create } from './create';

describe('create', () => {
  const foo = createPapiMethod({
    method: 'get',
    path: '/foo',
    async handler(req, res) {
      return 'foo';
    },
  });
  const bar = createPapiMethod({
    method: 'get',
    path: '/bar',
    async handler(req, res) {
      return 'bar';
    },
  });

  const fooOk = {
    resultCode: 'OK',
    payload: 'foo',
  };
  const notFound = {
    resultCode: 'Not found',
    payload: {},
  };
  const internalError = {
    resultCode: 'INTERNAL_ERROR',
    errorMessage: 'internal error',
  };

  function twiceAsyncNext(options) {
    const { withError, longRequest } = options;

    return () => {
      const simulateTwiceNext = (req, res, next) => {
        next();

        setImmediate(() => {
          next(withError ? new Error('test') : undefined);
        });
      };
      const simulateLongRequest = (req, res, next) => {
        // Will execute after second next() from simulateTwiceNext()
        setTimeout(next, 1000);
      };

      if (longRequest) {
        return [simulateTwiceNext, simulateLongRequest];
      }

      return simulateTwiceNext;
    };
  }

  function prepare(extraMiddlewares = [], setup = (ap) => ap) {
    const api = create(
      [foo, bar],
      [...extraMiddlewares, middlewares.handler(), middlewares.error({})]
    );
    const app = express().use('/api', api);
    setup(app);

    return supertest(app);
  }

  async function testTwiceAsyncNext(options) {
    const { status, body } = options;

    let failed = false;

    const request = prepare([twiceAsyncNext(options)], (app) => {
      app.use((error, req, re, next) => {
        failed = true;
      });
    });

    const res = await request.get('/api/foo').expect(status);

    expect(res.body).toEqual(body);
    expect(failed).toEqual(false);
  }

  it('fails on route duplicate', () => {
    expect(() => {
      create([foo, foo], []);
    }).toThrow("papi: route 'get /foo' already registered");
  });

  it('support returning arrays from createMiddleware()', async () => {
    let n = 5;

    const request = prepare([
      () => {
        return [
          (req, res, next) => {
            n++;
            next();
          },
          (req, res, next) => {
            n *= 2;
            next();
          },
        ];
      },
    ]);

    await request.get('/api/foo').expect(200);

    expect(n).toEqual(12);
  });

  it('works', async () => {
    const request = prepare();

    const res = await request
      .get('/api/foo')
      .expect('cache-control', 'no-cache,no-store,max-age=0,must-revalidate')
      .expect(200);

    expect(res.body).toEqual(fooOk);
  });

  it('catches unknown routes', async () => {
    const request = prepare();

    const res = await request
      .get('/api/unknown')
      .expect('cache-control', 'no-cache,no-store,max-age=0,must-revalidate')
      .expect(404);

    expect(res.body).toEqual(notFound);
  });

  // eslint-disable-next-line jest/expect-expect
  it('catches twice async next() calls', async () => {
    await testTwiceAsyncNext({
      withError: false,
      longRequest: false,
      status: 200,
      body: fooOk,
    });
  });

  // eslint-disable-next-line jest/expect-expect
  it('catches twice async next() calls with error', async () => {
    await testTwiceAsyncNext({
      withError: true,
      longRequest: false,
      status: 200,
      body: fooOk,
    });
  });

  // eslint-disable-next-line jest/expect-expect
  it('catches twice async next() calls with error and long request', async () => {
    await testTwiceAsyncNext({
      withError: true,
      longRequest: true,
      status: 500,
      body: internalError,
    });
  });
});
