import express from 'express';
import request from 'supertest';
import { measure } from '../index';

const createFakeDependencies = () => ({
  metrics: {
    counter: () => ({ inc: jest.fn() }),
    histogram: () => ({ startTimer: jest.fn(() => () => {}) }),
  },
});

describe('libs/measure-express-requests', () => {
  it('basic work', async () => {
    const deps = createFakeDependencies();
    const app = express();
    const mockedInc = jest.fn();
    const mockedDuration = jest.fn();

    deps.metrics.counter = () => ({ inc: mockedInc });
    deps.metrics.histogram = () => ({ startTimer: () => mockedDuration });

    app.use(
      measure({
        metrics: deps.metrics,
        metricsExcludePaths: [],
      })
    );

    await request(app).get('/');
    expect(mockedInc).toHaveBeenCalledTimes(3);
    expect(mockedInc).toHaveBeenNthCalledWith(1);
    expect(mockedInc).toHaveBeenNthCalledWith(2, { method: 'GET', status: 404 });
    expect(mockedInc).toHaveBeenNthCalledWith(3, { method: 'GET', status: 404 });
    expect(mockedDuration).toHaveBeenCalledTimes(1);
    expect(mockedDuration).toHaveBeenNthCalledWith(1, { method: 'GET', status: 404 });
  });

  it('filtering out paths', async () => {
    const deps = createFakeDependencies();
    const app = express();
    const mockedInc = jest.fn();
    const mockedDuration = jest.fn();

    deps.metrics.counter = () => ({ inc: mockedInc });
    deps.metrics.histogram = () => ({ startTimer: () => mockedDuration });

    app.use(
      measure({
        metrics: deps.metrics,
        metricsExcludePaths: ['/', '/metrics', '/route/*'],
      })
    );

    await request(app).get('/');
    await request(app).get('/metrics');
    await request(app).get('/metrics/');
    await request(app).get('/route/bibka/');
    await request(app).get('/route/bobka/');
    expect(mockedInc).toHaveBeenCalledTimes(0);
    expect(mockedDuration).toHaveBeenCalledTimes(0);
  });
});
