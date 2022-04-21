import fastify from 'fastify';
import request from 'supertest';
import { hostname as mockHostname } from 'os';
import type { APP_INFO_TOKEN } from '@tramvai/core';
import type { ENV_MANAGER_TOKEN } from '@tramvai/module-common';
import { xHeadersFactory } from './xHeaders';

const mockAppInfo: typeof APP_INFO_TOKEN = {
  appName: 'APP_NAME',
};

const mockEnvManager: typeof ENV_MANAGER_TOKEN = {
  get: jest.fn((env) => `env:${env.toLowerCase()}`),
} as any;

jest.mock('os', () => ({
  hostname: jest.fn(() => 'default'),
}));

describe('server/xHeaders', () => {
  const initApp = async () => {
    const app = fastify();

    const xHeaders = xHeadersFactory({
      app,
      envManager: mockEnvManager,
      appInfo: mockAppInfo,
    });

    await xHeaders();
    app.get('/', async (req, res) => {
      return 'OK';
    });

    await app.ready();

    return app.server;
  };

  it('should set xHeaders to response', async () => {
    return request(await initApp())
      .get('/')
      .expect(200)
      .expect('X-Host', 'default')
      .expect('X-App-Id', mockAppInfo.appName)
      .expect('X-App-Version', 'env:app_version')
      .expect('X-Deploy-Branch', 'env:deploy_branch')
      .expect('X-Deploy-Commit', 'env:deploy_commit')
      .expect('X-Deploy-Version', 'env:deploy_version')
      .expect('X-Deploy-Repository', 'env:deploy_repository');
  });

  it('should encrypt x-host header', async () => {
    (mockHostname as jest.Mock).mockImplementation(() => 'MacBook Pro — admin');

    return request(await initApp())
      .get('/')
      .expect(200)
      .expect('X-Host', 'MacBook%20Pro%20%E2%80%94%20admin')
      .expect('X-App-Id', mockAppInfo.appName)
      .expect('X-App-Version', 'env:app_version');
  });
});
