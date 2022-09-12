import matchers from 'expect/build/matchers';
import { Logger } from './logger';
import { LEVELS } from './constants';

jest.setSystemTime(0);

expect.extend({
  toMatchLog(received: jest.Mock, arg, name = '') {
    const mockCalls = received.mock.calls;
    const lastMockCalls = mockCalls[mockCalls.length - 1];

    return matchers.toEqual.call(
      // @ts-ignore
      this,
      lastMockCalls?.[0],
      expect.objectContaining({
        name,
        args: [arg],
      })
    );
  },
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toMatchLog(arg: any, name?: string): R;
    }
  }
}

describe('@tinkoff/logger', () => {
  beforeEach(() => {
    // Сбрасываем кеш в логгере перед каждым тестом
    // @ts-ignore
    Logger.instances = [];
    Logger.clear();
  });

  it('should have log functions for all levels and they should be binded to logger', () => {
    const logger = new Logger();

    // @ts-ignore
    logger.log = jest.fn();

    expect(logger.trace).toBeInstanceOf(Function);
    expect(logger.debug).toBeInstanceOf(Function);
    expect(logger.info).toBeInstanceOf(Function);
    expect(logger.warn).toBeInstanceOf(Function);
    expect(logger.error).toBeInstanceOf(Function);
    expect(logger.fatal).toBeInstanceOf(Function);

    const { error, trace } = logger;

    error('test-error');
    // @ts-ignore
    expect(logger.log).toHaveBeenCalledWith(LEVELS.error, ['test-error']);

    trace('test-trace');
    // @ts-ignore
    expect(logger.log).toHaveBeenCalledWith(LEVELS.trace, ['test-trace']);
  });

  describe('reporters', () => {
    const reporter1 = {
      log: jest.fn(),
    };
    const reporter2 = {
      log: jest.fn(),
    };

    beforeEach(() => {
      reporter1.log.mockClear();
      reporter2.log.mockClear();
    });

    it('reporters can be dynamically added', () => {
      const logger = new Logger({ name: '', level: 'error' });

      logger.error({ event: 'err', message: '1' });
      expect(reporter1.log).not.toHaveBeenCalled();
      expect(reporter2.log).not.toHaveBeenCalled();

      logger.addReporter(reporter1);
      logger.error({ event: 'err', message: '2' });

      expect(reporter1.log).toMatchLog({ event: 'err', message: '2' });
      expect(reporter2.log).not.toHaveBeenCalled();

      logger.addReporter(reporter2);
      logger.error({ event: 'err', message: '3' });
      expect(reporter1.log).toMatchLog({ event: 'err', message: '3' });
      expect(reporter2.log).toMatchLog({ event: 'err', message: '3' });
    });

    it('reporters can be replaced', () => {
      const logger = new Logger({ name: '', level: 'error', reporters: [reporter1] });

      logger.error('test1');

      expect(reporter1.log).toMatchLog('test1');
      expect(reporter2.log).not.toHaveBeenCalled();

      logger.setReporters([reporter2]);

      logger.error('test2');
      expect(reporter1.log).not.toMatchLog('test2');
      expect(reporter2.log).toMatchLog('test2');
    });

    it('should call reporters on log', () => {
      const logger = new Logger({ name: '', level: 'error', reporters: [reporter1, reporter2] });

      logger.info('test');
      expect(reporter1.log).not.toHaveBeenCalled();
      expect(reporter2.log).not.toHaveBeenCalled();

      logger.error({ event: 'err', message: 'testError' });
      expect(reporter1.log).toHaveBeenCalledWith({
        type: 'error',
        level: 10,
        name: '',
        date: new Date(),
        args: [
          {
            event: 'err',
            message: 'testError',
          },
        ],
      });
      expect(reporter2.log).toHaveBeenCalledWith({
        type: 'error',
        level: 10,
        name: '',
        date: new Date(),
        args: [
          {
            event: 'err',
            message: 'testError',
          },
        ],
      });
    });
  });

  describe('beforeReporters', () => {
    const reporter1 = {
      log: jest.fn(),
    };
    const reporter2 = {
      log: jest.fn(),
    };

    beforeEach(() => {
      reporter1.log.mockClear();
      reporter2.log.mockClear();
    });

    it('beforeReporters can be dynamically added', () => {
      const logger = new Logger({ name: '' });

      logger.error({ event: 'err', message: '1' });
      expect(reporter1.log).not.toHaveBeenCalled();
      expect(reporter2.log).not.toHaveBeenCalled();

      logger.addBeforeReporter(reporter1);
      logger.error({ event: 'err', message: '2' });

      expect(reporter1.log).toMatchLog({ event: 'err', message: '2' });
      expect(reporter2.log).not.toHaveBeenCalled();

      logger.addBeforeReporter(reporter2);
      logger.error({ event: 'err', message: '3' });
      expect(reporter1.log).toMatchLog({ event: 'err', message: '3' });
      expect(reporter2.log).toMatchLog({ event: 'err', message: '3' });
    });

    it('beforeReporters can be replaced', () => {
      const logger = new Logger({ name: '', beforeReporters: [reporter1] });

      logger.error('test1');

      expect(reporter1.log).toMatchLog('test1');
      expect(reporter2.log).not.toHaveBeenCalled();

      logger.setBeforeReporters([reporter2]);

      logger.error('test2');
      expect(reporter1.log).not.toMatchLog('test2');
      expect(reporter2.log).toMatchLog('test2');
    });

    it('should call beforeReporters on log', () => {
      const logger = new Logger({ name: '', beforeReporters: [reporter1, reporter2] });

      logger.info('test');
      expect(reporter1.log).toHaveBeenCalledWith({
        type: 'info',
        level: 30,
        name: '',
        date: new Date(),
        args: ['test'],
      });
      expect(reporter2.log).toHaveBeenCalledWith({
        type: 'info',
        level: 30,
        name: '',
        date: new Date(),
        args: ['test'],
      });

      logger.error({ event: 'err', message: 'testError' });
      expect(reporter1.log).toHaveBeenCalledWith({
        type: 'error',
        level: 10,
        name: '',
        date: new Date(),
        args: [
          {
            event: 'err',
            message: 'testError',
          },
        ],
      });
      expect(reporter2.log).toHaveBeenCalledWith({
        type: 'error',
        level: 10,
        name: '',
        date: new Date(),
        args: [
          {
            event: 'err',
            message: 'testError',
          },
        ],
      });
    });
  });

  describe('filters', () => {
    const filter1 = {
      filter: jest.fn(),
    };
    const filter2 = {
      filter: jest.fn(),
    };

    beforeEach(() => {
      filter1.filter.mockClear();
      filter2.filter.mockClear();
    });

    it('filters can be added dynamically', () => {
      const logger = new Logger({ name: '', level: 'error', filters: [filter1] });

      logger.error('test1');

      expect(filter1.filter).toMatchLog('test1');
      expect(filter2.filter).not.toHaveBeenCalled();

      logger.addFilter(filter2);
      logger.error('test2');
      expect(filter1.filter).toMatchLog('test2');
      expect(filter2.filter).toMatchLog('test2');
    });

    it('filters can be replaced', () => {
      const logger = new Logger({ name: '', level: 'error', filters: [filter1] });

      logger.error('test1');

      expect(filter1.filter).toMatchLog('test1');
      expect(filter2.filter).not.toHaveBeenCalled();

      logger.setFilters(filter2);
      logger.error('test2');
      expect(filter1.filter).not.toMatchLog('test2');
      expect(filter2.filter).toMatchLog('test2');
    });

    it('filters can block logs', () => {
      const reporter = { log: jest.fn() };
      const logger = new Logger({
        name: '',
        level: 'error',
        filters: [filter1, filter2],
        reporters: [reporter],
      });

      logger.error('filter-test-1');
      expect(filter1.filter).toMatchLog('filter-test-1');
      expect(filter2.filter).toMatchLog('filter-test-1');
      expect(reporter.log).toMatchLog('filter-test-1');

      filter1.filter.mockImplementationOnce(() => false);

      logger.error('filter-test-2');
      expect(filter1.filter).toMatchLog('filter-test-2');
      expect(filter2.filter).not.toMatchLog('filter-test-2');
      expect(reporter.log).not.toMatchLog('filter-test-2');
    });
  });

  describe('extensions', () => {
    const extension1 = {
      extend: jest.fn((x) => x),
    };
    const extension2 = {
      extend: jest.fn((x) => x),
    };

    beforeEach(() => {
      extension1.extend.mockClear();
      extension2.extend.mockClear();
    });

    it('extensions can be added dynamically', () => {
      const logger = new Logger({ name: '', level: 'error', extensions: [extension1] });

      logger.error('test1');

      expect(extension1.extend).toMatchLog('test1');
      expect(extension2.extend).not.toHaveBeenCalled();

      logger.addExtension(extension2);
      logger.error('test2');
      expect(extension1.extend).toMatchLog('test2');
      expect(extension2.extend).toMatchLog('test2');
    });

    it('extensions can be replaced', () => {
      const logger = new Logger({ name: '', level: 'error', extensions: [extension1] });

      logger.error('test1');

      expect(extension1.extend).toMatchLog('test1');
      expect(extension2.extend).not.toHaveBeenCalled();

      logger.setExtensions(extension2);
      logger.error('test2');
      expect(extension1.extend).not.toMatchLog('test2');
      expect(extension2.extend).toMatchLog('test2');
    });

    it('extensions can change logObj', () => {
      const reporter = { log: jest.fn() };
      const logger = new Logger({
        name: '',
        level: 'error',
        extensions: [extension1, extension2],
        reporters: [reporter],
      });

      logger.error('extend-test-1');
      expect(extension1.extend).toMatchLog('extend-test-1');
      expect(extension2.extend).toMatchLog('extend-test-1');
      expect(reporter.log).toMatchLog('extend-test-1');

      extension1.extend.mockImplementationOnce((logObj) => ({
        ...logObj,
        args: ['extended'],
      }));

      logger.error('extend-test-2');
      expect(extension1.extend).toMatchLog('extend-test-2');
      expect(extension2.extend).not.toMatchLog('extend-test-2');
      expect(extension2.extend).toMatchLog('extended');
      expect(reporter.log).not.toMatchLog('extend-test-2');
      expect(reporter.log).toMatchLog('extended');
    });
  });

  describe('static methods', () => {
    const reporter = {
      log: jest.fn(),
    };
    const logger = new Logger({ name: '', reporters: [reporter] });

    beforeEach(() => {
      Logger.clear();
      reporter.log.mockClear();
    });

    it('setLevel', () => {
      logger.info('test1');

      expect(reporter.log).not.toHaveBeenCalled();

      Logger.setLevel('info');

      logger.info('test2');
      expect(reporter.log).toMatchLog('test2');
    });

    it('setLevel with wrong level', () => {
      logger.info('test1');

      expect(reporter.log).not.toHaveBeenCalled();

      (Logger as any).setLevel();

      logger.info('test2');
      expect(reporter.log).not.toHaveBeenCalled();

      Logger.setLevel('random' as any);

      logger.info('test2');
      expect(reporter.log).not.toHaveBeenCalled();
    });

    it('enable/disable', () => {
      const childLogger1 = logger.child('l-1');
      const childLogger2 = logger.child('l-2');

      childLogger1.info('test1-1');
      expect(reporter.log).not.toMatchLog('test1-1', 'l-1');
      childLogger2.info('test1-2');
      expect(reporter.log).not.toMatchLog('test1-2', 'l-2');

      Logger.enable('l-1');

      childLogger1.info('test2-1');
      expect(reporter.log).toMatchLog('test2-1', 'l-1');
      childLogger2.info('test2-2');
      expect(reporter.log).not.toMatchLog('test2-2', 'l-2');

      Logger.enable('warn', 'l-2');

      childLogger1.info('test3-1');
      expect(reporter.log).toMatchLog('test3-1', 'l-1');
      childLogger2.info('test3-2');
      expect(reporter.log).not.toMatchLog('test3-2', 'l-2');

      childLogger1.warn('test4-1');
      expect(reporter.log).toMatchLog('test4-1', 'l-1');
      childLogger2.warn('test4-2');
      expect(reporter.log).toMatchLog('test4-2', 'l-2');

      Logger.disable('l-1');

      childLogger1.warn('test5-1');
      expect(reporter.log).not.toMatchLog('test5-1', 'l-1');
      childLogger2.warn('test5-2');
      expect(reporter.log).toMatchLog('test5-2', 'l-2');

      Logger.disable('l-*');

      childLogger1.error('test6-1');
      expect(reporter.log).not.toMatchLog('test6-1', 'l-1');
      childLogger2.error('test6-2');
      expect(reporter.log).not.toMatchLog('test6-2', 'l-2');

      Logger.enable('l-*');

      const childLogger3 = logger.child('l-3');

      childLogger3.trace('test7-1');
      expect(reporter.log).toMatchLog('test7-1', 'l-3');
    });
  });
});
