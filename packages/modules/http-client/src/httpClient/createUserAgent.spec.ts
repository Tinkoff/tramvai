import { createUserAgent } from './createUserAgent';

describe('http-client/utils/createUserAgent', () => {
  it('createUserAgent', () => {
    const appName = 'example';
    const appVersion = '0.1.0';
    const appInfo = { appName };
    const envManager = {
      get: jest.fn((env) => {
        if (env === 'APP_VERSION') {
          return appVersion;
        }
      }),
    } as any;

    expect(createUserAgent({ appInfo, envManager })).toEqual('tramvai example version 0.1.0');
  });
});
