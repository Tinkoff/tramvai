import fastify from 'fastify';
import { fastifyMeasureRequests } from '../index';

const createFakeDependencies = () => ({
  metrics: {
    counter: () => ({ inc: jest.fn() }),
    histogram: () => ({ startTimer: jest.fn(() => () => {}) }),
  },
});

describe('libs/measure-fastify-requests', () => {
  it('basic work', async () => {
    const deps = createFakeDependencies();
    const app = fastify();
    const mockedInc = jest.fn();
    const mockedDuration = jest.fn();

    deps.metrics.counter = () => ({ inc: mockedInc });
    deps.metrics.histogram = () => ({ startTimer: () => mockedDuration });

    await app.register(fastifyMeasureRequests, {
      metrics: deps.metrics as any,
      metricsExcludePaths: [],
    });

    await app.inject({
      method: 'GET',
      url: '/',
    });

    expect(mockedInc).toHaveBeenCalledTimes(3);
    expect(mockedInc).toHaveBeenNthCalledWith(1);
    expect(mockedInc).toHaveBeenNthCalledWith(2, { method: 'GET', status: 404 });
    expect(mockedInc).toHaveBeenNthCalledWith(3, { method: 'GET', status: 404 });
    expect(mockedDuration).toHaveBeenCalledTimes(1);
    expect(mockedDuration).toHaveBeenNthCalledWith(1, { method: 'GET', status: 404 });
  });

  it('filtering out paths', async () => {
    const deps = createFakeDependencies();
    const app = fastify();
    const mockedInc = jest.fn();
    const mockedDuration = jest.fn();

    deps.metrics.counter = () => ({ inc: mockedInc });
    deps.metrics.histogram = () => ({ startTimer: () => mockedDuration });

    await app.register(fastifyMeasureRequests, {
      metrics: deps.metrics as any,
      metricsExcludePaths: ['/', '/metrics', '/route/*'],
    });

    await app.inject({
      method: 'GET',
      url: '/',
    });
    await app.inject({
      method: 'GET',
      url: '/metrics',
    });
    await app.inject({
      method: 'GET',
      url: '/metrics/',
    });
    await app.inject({
      method: 'GET',
      url: '/route/bibka/',
    });
    await app.inject({
      method: 'GET',
      url: '/route/bobka/',
    });
    expect(mockedInc).toHaveBeenCalledTimes(0);
    expect(mockedDuration).toHaveBeenCalledTimes(0);
  });
});
