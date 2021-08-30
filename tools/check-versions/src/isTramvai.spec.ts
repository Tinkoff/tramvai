import { isTramvai } from './isTramvai';

describe('[tools/check-versions] isTramvai', () => {
  it('should return true for tramvai deps', () => {
    [
      '@tramvai/module-common',
      '@tramvai/tokens-route',
      '@tramvai/test',
      '@tramvai/state',
      '@tramvai/react',
      '@tramvai/papi',
      '@tramvai-tinkoff/module-confirmation',
      '@tramvai-tinkoff/tokens-whatever',
    ].forEach((dep) => expect(isTramvai(dep)).toBe(true));
  });

  it('should return false for not-tramvai deps', () => {
    ['@tinkoff/logger', '@tramvai/safe-strings', 'module-common', 'fs-extra'].forEach((dep) =>
      expect(isTramvai(dep)).toBe(false)
    );
  });
});
