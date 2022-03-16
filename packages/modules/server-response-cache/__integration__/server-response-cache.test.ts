import { testApp } from '@tramvai/internal-test-utils/testApp';

describe('module-server-response-cache', () => {
  const { getApp } = testApp({
    name: 'server-response-cache',
  });

  it('should cache response for the 1 minute', async () => {
    const { request } = getApp();
    let { headers } = await request('/');

    expect(headers['x-tramvai-response-cache']).toBeUndefined();

    ({ headers } = await request('/'));

    expect(headers['x-tramvai-response-cache']).toBe('true');

    ({ headers } = await request('/test/'));

    expect(headers['x-tramvai-response-cache']).toBeUndefined();

    ({ headers } = await request('/test/'));

    expect(headers['x-tramvai-response-cache']).toBe('true');
  });
});
