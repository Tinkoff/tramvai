import express from 'express';
import request from 'supertest';
import { hostname as mockHostname } from 'os';
import type { APP_INFO_TOKEN } from '@tramvai/core';
import type { ENV_MANAGER_TOKEN } from '@tramvai/module-common';
import { xHeadersFactory } from './xHeaders';

const mockAppInfo: typeof APP_INFO_TOKEN = {
  appName: 'APP_NAME',
};
const mockEnvManager: typeof ENV_MANAGER_TOKEN = {
  get: jest.fn(() => 'env'),
} as any;

jest.mock('os', () => ({
  hostname: jest.fn(() => 'default'),
}));

describe('server/xHeaders', () => {
  const app = express();

  const xHeaders = xHeadersFactory({
    app,
    envManager: mockEnvManager,
    appInfo: mockAppInfo,
  });

  beforeAll(async () => {
    await xHeaders();
    app.get('/', (req, res) => {
      res.end('OK');
    });
  });

  it('should set xHeaders to response', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect('X-Host', 'default')
      .expect('X-App-Id', mockAppInfo.appName)
      .expect('X-App-Version', 'env');
  });

  it('should encrypt x-host header', () => {
    (mockHostname as jest.Mock).mockImplementation(() => 'MacBook Pro — admin');

    return request(app)
      .get('/')
      .expect(200)
      .expect('X-Host', 'MacBook%20Pro%20%E2%80%94%20admin')
      .expect('X-App-Id', mockAppInfo.appName)
      .expect('X-App-Version', 'env');
  });
});
