import { createMockEnvManager } from './envManager';

describe('test/mocks/envManager', () => {
  it('test', () => {
    const envManager = createMockEnvManager({
      a: 'aaa',
      b: 'bbb',
    });

    expect(envManager.get('a')).toBe('aaa');
    expect(envManager.get('b')).toBe('bbb');

    expect(envManager.getAll()).toEqual({ a: 'aaa', b: 'bbb' });
  });
});
