import { normalizeLogObj } from './normalizeLogObj';

describe('@tinkoff/logger utils normalizeLogObj', () => {
  it('Replace circular references', () => {
    const a = {} as any;
    const b = {} as any;
    const c = {} as any;

    // circular log object
    a.c = c;
    b.a = a;
    c.b = b;

    normalizeLogObj(c);

    expect(c).toEqual({ b: { a: { c: '[Circular]' } } });

    const d = {} as any;
    const e = {} as any;
    const f = {} as any;

    // not circular log object
    d.e = e;
    f.e = e;
    f.d = d;

    normalizeLogObj(f);

    expect(f).toEqual({ d: { e: {} }, e: {} });
  });

  it('Replace deep objects', () => {
    const logObj = {
      a: {
        b: {
          c: {
            to: 'deep',
          },
        },
      },
    } as any;

    normalizeLogObj(logObj, { depthLimit: 3 });

    expect(logObj).toEqual({ a: { b: { c: '[...]' } } });
  });

  it('Complete test', () => {
    const logObj = {
      a: {
        aaa: {
          to: 'deep',
        },
      },
      b: null,
      c: [{ to: 'deep' }],
      self: null,
    } as any;

    logObj.self = logObj;

    normalizeLogObj(logObj, { depthLimit: 2 });

    expect(logObj).toEqual({ a: { aaa: '[...]' }, b: null, c: ['[...]'], self: '[Circular]' });
  });
});
