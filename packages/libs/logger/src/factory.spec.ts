import { createLoggerFactory } from './factory';

class DefaultReporter {
  log = jest.fn();
}

const loggerFactory = createLoggerFactory({
  name: '',
  reporters: [new DefaultReporter()],
  defaults: {
    pid: process.pid,
    hostname: 'fake-hostname',
  },
});

describe('@tinkoff/logger/factory', () => {
  beforeEach(() => {
    // Сбрасываем кеш в логгере перед каждым тестом
    // @ts-ignore
    loggerFactory.instances = [];
    loggerFactory.setReporters(new DefaultReporter());
    loggerFactory.clear();
  });

  it('setGlobalReporters applies to child reporters', () => {
    class TestReporter {
      log = jest.fn();
    }

    const track1 = loggerFactory('name-1');
    loggerFactory.setGlobalReporters(new TestReporter());
    // same name as previous
    const track2 = loggerFactory('name-1');
    const track3 = loggerFactory('name-2');

    // @ts-ignore
    expect(track1.reporters[0]).toBeInstanceOf(TestReporter);
    // @ts-ignore
    expect(track2.reporters[0]).toBeInstanceOf(TestReporter);
    // @ts-ignore
    expect(track3.reporters[0]).toBeInstanceOf(TestReporter);
  });
});
