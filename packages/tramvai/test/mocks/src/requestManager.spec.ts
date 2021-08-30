import { createMockRequestManager } from './requestManager';

describe('test/mocks/requestManager', () => {
  it('defaults', () => {
    const requestManager = createMockRequestManager();

    expect(requestManager.getClientIp()).toBe('127.0.0.1');
    expect(requestManager.getHeaders()).toEqual({});
    expect(requestManager.getUrl()).toBe('http://localhost');
  });

  it('specified settings', () => {
    const requestManager = createMockRequestManager({
      headers: { a: 'aaa', b: 'bbb' },
      url: 'https://www.tinkoff.ru',
    });

    expect(requestManager.getClientIp()).toBe('127.0.0.1');
    expect(requestManager.getHeader('a')).toBe('aaa');
    expect(requestManager.getUrl()).toBe('https://www.tinkoff.ru');
  });
});
