import { createMockLogger } from './logger';

describe('test/mocks/logger', () => {
  it('test', () => {
    const logger = createMockLogger();

    expect(logger.warn).toBeInstanceOf(Function);
    expect(logger.info).toBeInstanceOf(Function);

    const instance = logger('test');

    expect(instance.debug).toBeInstanceOf(Function);
    expect(instance.info).toBeInstanceOf(Function);
  });
});
