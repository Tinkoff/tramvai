import express from 'express';
import type { Server } from 'http';
import { createServer } from 'http';
import { getPort } from '@tramvai/internal-test-utils/utils/getPort';
import fetch from 'node-fetch';
import { Mocker, FileSystemMockRepository } from './index';

const listen = (server: Server, port: number) => {
  return new Promise<void>((resolve, reject) => {
    server.on('error', (error) => {
      reject(error);
    });

    server.listen(port, resolve);
  });
};

describe('Mocker', () => {
  const mockerHandler = jest.fn();
  const targetHandler = jest.fn();
  let mockerPort: number;
  let mockerServer: Server;
  let mockerAddress: string;
  let targetPort: number;
  let targetServer: Server;
  let targetAddress: string;

  beforeAll(async () => {
    mockerPort = await getPort();
    targetPort = await getPort();

    mockerServer = createServer(mockerHandler);
    targetServer = createServer(targetHandler);

    mockerAddress = `http://localhost:${mockerPort}`;
    targetAddress = `http://localhost:${targetPort}`;

    return Promise.all([listen(mockerServer, mockerPort), listen(targetServer, targetPort)]);
  });

  afterAll(() => {
    return Promise.all([
      new Promise((resolve) => {
        mockerServer.close(resolve);
      }),
      new Promise((resolve) => {
        targetServer.close(resolve);
      }),
    ]);
  });

  it('initialization', async () => {
    const mocker = new Mocker({
      logger: console,
      passUnhandledRequests: true,
      apis: {
        'first-api': {
          target: `${targetAddress}/`,
        },
        'second-api': {
          target: 'https://test.second.api/',
        },
      },
      repositories: [
        {
          getAll: async () => {
            return {
              'first-api': {
                'GET /foo': (req, res) => {
                  res.json({ fake: 'true' });
                },
              },
              'second-api': {
                'GET /bar': (req, res) => {
                  res.json({ fake: 'true' });
                },
                'POST /bar': (req, res) => {
                  res.json({ fake: 'true' });
                },
              },
            };
          },
        } as any,
      ],
    });

    await mocker.init();

    const target = express();
    target.get('/foo', (req, res) => {
      res.json({ real: 'true' });
    });
    target.get('/bar', (req, res) => {
      res.json({ real: 'true' });
    });
    target.post('/bar', (req, res) => {
      res.json({ real: 'true' });
    });

    mockerHandler.mockImplementation((req, res) => {
      mocker.use(req, res);
    });
    targetHandler.mockImplementation((req, res) => {
      target(req, res);
    });

    const fakeResponse = await fetch(`${mockerAddress}/first-api/foo`);
    const fakePayload = await fakeResponse.json();

    expect(fakePayload).toEqual({ fake: 'true' });

    const getResponse = await fetch(`${mockerAddress}/first-api/bar`);
    const getPayload = await getResponse.json();

    expect(getPayload).toEqual({ real: 'true' });

    const postResponse = await fetch(`${mockerAddress}/first-api/bar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        test: 'post',
      }),
    });
    const postPayload = await postResponse.json();

    expect(postPayload).toEqual({ real: 'true' });
  });

  // eslint-disable-next-line max-statements
  it('query', async () => {
    const mocker = new Mocker({
      logger: console,
      passUnhandledRequests: true,
      apis: {
        'first-api': {
          target: `${targetAddress}/`,
        },
      },
      repositories: [
        {
          getAll: async (api: string) => {
            return {
              'first-api': {
                'GET /foo?key=1': {
                  payload: { fake: 'true' },
                },
                'GET /bar?key=1': {
                  payload: { fake: 'true' },
                },
                'GET /baz?a=1&b=2': {
                  query: { c: 3 },
                  payload: { fake: 'true' },
                },
              },
            };
          },
        } as any,
      ],
    });

    await mocker.init();

    const target = express();
    target.get('/foo', (req, res) => {
      res.json({ real: 'true' });
    });
    target.get('/bar', (req, res) => {
      res.json({ real: 'true' });
    });
    target.get('/baz', (req, res) => {
      res.json({ real: 'true' });
    });

    mockerHandler.mockImplementation((req, res) => {
      mocker.use(req, res);
    });
    targetHandler.mockImplementation((req, res) => {
      target(req, res);
    });

    const response1 = await fetch(`${mockerAddress}/first-api/foo`);
    const payload1 = await response1.json();
    expect(payload1).toEqual({ real: 'true' });

    const response2 = await fetch(`${mockerAddress}/first-api/bar`);
    const payload2 = await response2.json();
    expect(payload2).toEqual({ real: 'true' });

    const response3 = await fetch(`${mockerAddress}/first-api/baz`);
    const payload3 = await response3.json();
    expect(payload3).toEqual({ real: 'true' });

    const response4 = await fetch(`${mockerAddress}/first-api/foo?key=1`);
    const payload4 = await response4.json();
    expect(payload4).toEqual({ fake: 'true' });

    const response5 = await fetch(`${mockerAddress}/first-api/bar?key=1`);
    const payload5 = await response5.json();
    expect(payload5).toEqual({ fake: 'true' });

    const response6 = await fetch(`${mockerAddress}/first-api/baz?a=1&b=2`);
    const payload6 = await response6.json();
    expect(payload6).toEqual({ fake: 'true' });
  });

  // eslint-disable-next-line max-statements
  it('update', async () => {
    const getAllMock = jest.fn(async (api: string) => {
      return {
        'first-api': {
          'GET /foo': {
            payload: { fake: 'old' },
          },
        },
      };
    });

    const mocker = new Mocker({
      logger: console,
      passUnhandledRequests: true,
      apis: {
        'first-api': {
          target: `${targetAddress}/`,
        },
      },
      repositories: [
        {
          getAll: getAllMock,
        } as any,
      ],
    });

    await mocker.init();

    mockerHandler.mockImplementation((req, res) => {
      mocker.use(req, res);
    });

    const response1 = await fetch(`${mockerAddress}/first-api/foo`);
    const payload1 = await response1.json();
    expect(payload1).toEqual({ fake: 'old' });

    getAllMock.mockImplementation(async () => {
      return {
        'first-api': {
          'GET /foo': {
            payload: { fake: 'new' },
          },
        },
      };
    });

    await mocker.update();

    const response2 = await fetch(`${mockerAddress}/first-api/foo`);
    const payload2 = await response2.json();
    expect(payload2).toEqual({ fake: 'new' });
  });

  it('file system mocks', async () => {
    const mocker = new Mocker({
      logger: console,
      apis: {
        'first-api': {
          target: 'https://test.first.api/',
        },
        'second-api': {
          target: 'https://test.second.api/',
        },
      },
      repositories: [
        new FileSystemMockRepository({
          cwd: __dirname,
        }),
      ],
    });

    await mocker.init();

    mockerHandler.mockImplementation((req, res) => {
      mocker.use(req, res);
    });

    const response1 = await fetch(`${mockerAddress}/first-api/foo`);
    const payload1 = await response1.json();
    expect(payload1).toEqual({ fake: 'true' });

    const response2 = await fetch(`${mockerAddress}/first-api/foo`, { method: 'POST' });
    const payload2 = await response2.json();
    expect(payload2).toEqual({ fake: 'true' });

    const response3 = await fetch(`${mockerAddress}/second-api/bar`);
    const payload3 = await response3.json();
    expect(payload3).toEqual({ fake: 'true' });

    const response4 = await fetch(`${mockerAddress}/second-api/bar`, { method: 'POST' });
    const payload4 = await response4.json();
    expect(payload4).toEqual({ fake: 'true' });
  });

  it('adding and removing mocks', async () => {
    const mocker = new Mocker({
      logger: console,
      passUnhandledRequests: true,
      apis: {
        'first-api': {
          target: `${targetAddress}/`,
        },
      },
      repositories: [],
    });

    const target = express();
    target.get('/foo', (req, res) => {
      res.json({ real: 'true' });
    });
    target.get('/new', (req, res) => {
      res.json({ real: 'true' });
    });

    mockerHandler.mockImplementation((req, res) => {
      mocker.use(req, res);
    });
    targetHandler.mockImplementation((req, res) => {
      target(req, res);
    });

    await mocker.init();

    const response1 = await fetch(`${mockerAddress}/first-api/foo`);
    const payload1 = await response1.json();
    expect(payload1).toEqual({ real: 'true' });

    const response2 = await fetch(`${mockerAddress}/first-api/new`);
    const payload2 = await response2.json();
    expect(payload2).toEqual({ real: 'true' });

    mocker.addMocks('first-api', {
      'GET /new': {
        status: 200,
        payload: {
          fake: 'true',
        },
        headers: {},
      },
    });

    const response3 = await fetch(`${mockerAddress}/first-api/new`);
    const payload3 = await response3.json();
    expect(payload3).toEqual({ fake: 'true' });

    mocker.removeMocks('first-api', ['GET /new']);

    const response4 = await fetch(`${mockerAddress}/first-api/new`);
    const payload4 = await response4.json();
    expect(payload4).toEqual({ real: 'true' });
  });
});
