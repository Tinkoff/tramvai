import http from 'http';
import { ENV_MANAGER_TOKEN } from '@tramvai/tokens-common';
import { SERVER_TOKEN } from '@tramvai/tokens-server';
import { CommonModule } from '@tramvai/module-common';
import { createTestApp } from './createTestApp';

describe('test/unit/app/createTestApp', () => {
  it('should return app', async () => {
    const { app, close } = await createTestApp();
    const envManager = app.di.get(ENV_MANAGER_TOKEN);

    expect(envManager.get('FRONT_LOG_API')).toBe('test');
    expect(envManager.get('TEST_ENV')).toBeUndefined();
    expect(app.di.get(SERVER_TOKEN)).toBeInstanceOf(http.Server);

    return close();
  });

  it('should specify env', async () => {
    const { app, close } = await createTestApp({
      env: {
        TEST_ENV: '1234',
      },
    });

    const envManager = app.di.get(ENV_MANAGER_TOKEN);

    expect(envManager.get('FRONT_LOG_API')).toBe('test');
    expect(envManager.get('TEST_ENV')).toBe('1234');

    return close();
  });

  it('should ignore default modules', async () => {
    const { app } = await createTestApp({
      excludeDefaultModules: true,
      modules: [CommonModule],
    });

    expect(() => app.di.get(SERVER_TOKEN)).toThrow('Token not found');
  });

  it('should return mocker instance', async () => {
    const { mocker, close } = await createTestApp();

    expect(mocker).toBeDefined();

    return close();
  });
});
