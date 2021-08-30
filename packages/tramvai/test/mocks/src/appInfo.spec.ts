import { createMockAppInfo } from './appInfo';

describe('test/mocks/appInfo', () => {
  it('test', () => {
    expect(createMockAppInfo()).toEqual({
      appName: 'test',
    });

    expect(createMockAppInfo({ appName: 'app' })).toEqual({
      appName: 'app',
    });
  });
});
