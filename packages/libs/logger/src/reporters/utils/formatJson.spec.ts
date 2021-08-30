import { formatError, formatJson } from './formatJson';

describe('reporters/utils/formatJson', () => {
  it('should format errors', () => {
    const message = 'test Message';
    const stack = 'mockStack';
    const prop = 'prop';
    const body = { biba: 1 };
    const code = 302;

    expect(formatError(Object.assign(new Error(message), { stack, prop, body, code }))).toEqual({
      message,
      stack,
      prop,
      body: '{"biba":1}',
      code: '302',
    });
  });

  it('should format errors if error is string', () => {
    const message = 'test Message';

    expect(formatError(message).message).toEqual(message);
    expect(formatError(message).stack).not.toBeUndefined();
  });

  it('should format to json view', () => {
    const date = new Date(0);

    expect(formatJson({ name: 'test', args: ['trace 123'], date, level: 0 })).toEqual({
      name: 'test',
      message: 'trace 123',
      date,
      level: 0,
    });
    expect(
      formatJson({ name: 'test', date, level: 1, args: [{ event: 'test', a: { b: 1 }, c: 2 }] })
    ).toEqual({ name: 'test', date, level: 1, event: 'test', a: { b: 1 }, c: 2 });
    expect(
      formatJson({
        name: 'test',
        date,
        level: 2,
        args: [{ event: '123', a: 1, message: 'my message' }],
      })
    ).toEqual({ name: 'test', date, level: 2, event: '123', a: 1, message: 'my message' });
    expect(
      formatJson({ name: 'test', date, level: 3, args: [{ event: 'args', args: [1, 2, [3, 4]] }] })
    ).toEqual({ name: 'test', date, level: 3, event: 'args', args: [1, 2, [3, 4]] });
    expect(
      formatJson({
        name: 'test',
        date,
        level: 4,
        args: [Object.assign(new Error('arg1'), { stack: 'mockStack' })],
      })
    ).toEqual({
      name: 'test',
      date,
      level: 4,
      message: 'arg1',
      error: {
        message: 'arg1',
        stack: 'mockStack',
      },
    });
    expect(
      formatJson({
        name: 'test',
        date,
        level: 5,
        args: [Object.assign(new Error('arg2'), { stack: 'mockStack' }), 'custom message'],
      })
    ).toEqual({
      name: 'test',
      date,
      level: 5,
      message: 'custom message',
      error: {
        message: 'arg2',
        stack: 'mockStack',
      },
    });
    expect(
      formatJson({
        name: 'test',
        date,
        level: 6,
        args: [Object.assign(new Error('arg3'), { stack: 'mockStack' }), [1, 2], { a: 3 }],
      })
    ).toEqual({
      name: 'test',
      date,
      level: 6,
      message: 'arg3',
      error: {
        message: 'arg3',
        stack: 'mockStack',
      },
      args: [[1, 2], { a: 3 }],
    });
    expect(
      formatJson({
        name: 'test',
        date,
        level: 7,
        args: ['1', 2, Object.assign(new Error('arg4'), { stack: 'mockStack' })],
      })
    ).toEqual({
      name: 'test',
      date,
      level: 7,
      message: '1',
      args: [2, { error: { message: 'arg4', stack: 'mockStack' } }],
    });
  });
});
