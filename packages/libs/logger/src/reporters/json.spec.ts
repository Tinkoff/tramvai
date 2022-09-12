import { createLoggerFactory } from '../factory';
import { JSONReporter } from './json';

jest.setSystemTime(0);

const mockStream = {
  write: jest.fn(),
};

const logger = createLoggerFactory({
  name: '',
  reporters: [new JSONReporter({ stream: mockStream } as any)],
});

describe('log/reporters/json', () => {
  beforeEach(() => {
    mockStream.write.mockClear();
  });

  it('should log into mockStream', () => {
    const log = logger('base test');

    logger.setLevel('trace');

    log.trace('trace 123');
    log.debug({ event: 'test', a: { b: 1 }, c: 2 });
    log.info('info data');
    log.info({ event: '123', a: 1, message: 'my message' });
    log.warn({ event: 'args', args: [1, 2, [3, 4]] });
    log.error(Object.assign(new Error('arg1'), { stack: 'mockStack' }));
    log.error(Object.assign(new Error('arg2'), { stack: 'mockStack' }), 'custom message');
    // @ts-ignore
    log.error(Object.assign(new Error('arg3'), { stack: 'mockStack' }), [1, 2], { a: 3 });
    // @ts-ignore
    log.error(1, 2, Object.assign(new Error('arg4'), { stack: 'mockStack' }));

    expect(mockStream.write.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "{"date":"1970-01-01T00:00:00.000Z","name":"base test","type":"trace","level":50,"message":"trace 123"}
      ",
        ],
        [
          "{"date":"1970-01-01T00:00:00.000Z","name":"base test","type":"debug","level":40,"event":"test","a":{"b":1},"c":2}
      ",
        ],
        [
          "{"date":"1970-01-01T00:00:00.000Z","name":"base test","type":"info","level":30,"message":"info data"}
      ",
        ],
        [
          "{"date":"1970-01-01T00:00:00.000Z","name":"base test","type":"info","level":30,"event":"123","a":1,"message":"my message"}
      ",
        ],
        [
          "{"date":"1970-01-01T00:00:00.000Z","name":"base test","type":"warn","level":20,"args":[1,2,[3,4]],"event":"args"}
      ",
        ],
        [
          "{"date":"1970-01-01T00:00:00.000Z","name":"base test","type":"error","level":10,"error":{"message":"arg1","stack":"mockStack"},"message":"arg1"}
      ",
        ],
        [
          "{"date":"1970-01-01T00:00:00.000Z","name":"base test","type":"error","level":10,"error":{"message":"arg2","stack":"mockStack"},"message":"custom message"}
      ",
        ],
        [
          "{"date":"1970-01-01T00:00:00.000Z","name":"base test","type":"error","level":10,"args":[[1,2],{"a":3}],"error":{"message":"arg3","stack":"mockStack"},"message":"arg3"}
      ",
        ],
        [
          "{"date":"1970-01-01T00:00:00.000Z","name":"base test","type":"error","level":10,"args":[2,{"error":{"message":"arg4","stack":"mockStack"}}],"message":1}
      ",
        ],
      ]
    `);
  });
});
