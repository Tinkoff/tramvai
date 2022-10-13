/* eslint-disable jest/expect-expect */
import { expectTypeOf } from 'expect-type';
import { provide } from './provide';
import type { ExtractTokenType } from './createToken/createToken';
import { createToken, optional } from './createToken/createToken';

const NUMBER_TOKEN = createToken<number>('number');
const BOOLEAN_TOKEN = createToken<boolean>('boolean');
const STRING_TOKEN = createToken<string>('string');
const OBJECT_TOKEN = createToken<{ a: { b: string; c: number }; d: boolean }>('object');

const NUMBER_MULTI_TOKEN = createToken<number>('number', { multi: true });
const BOOLEAN_MULTI_TOKEN = createToken<boolean>('boolean', { multi: true });
const STRING_MULTI_TOKEN = createToken<string>('string', { multi: true });
const OBJECT_MULTI_TOKEN = createToken<{ a: { b: string; c: number }; d: boolean }>('object', {
  multi: true,
});

describe('useValue', () => {
  it('number token', async () => {
    provide({
      provide: NUMBER_TOKEN,
      // @ts-expect-error
      useValue: 'test',
    });

    provide({
      provide: NUMBER_TOKEN,
      useValue: 5,
    });
  });

  it('string token', () => {
    provide({
      provide: STRING_TOKEN,
      // @ts-expect-error
      useValue: 0,
    });
    provide({
      provide: STRING_TOKEN,
      // @ts-expect-error
      useValue: [0],
    });

    provide({
      provide: STRING_TOKEN,
      // @ts-expect-error
      useValue: {},
    });
    provide({
      provide: STRING_TOKEN,
      // @ts-expect-error
      useValue: [{}],
    });

    provide({
      provide: STRING_TOKEN,
      // @ts-expect-error
      useValue: [''],
    });
    provide({
      provide: STRING_TOKEN,
      useValue: '',
    });
  });

  it('multi token', () => {
    provide({
      provide: STRING_MULTI_TOKEN,
      // @ts-expect-error
      useValue: 0,
    });
    provide({
      provide: STRING_MULTI_TOKEN,
      // @ts-expect-error
      useValue: [0],
    });

    provide({
      provide: STRING_MULTI_TOKEN,
      // @ts-expect-error
      useValue: {},
    });
    provide({
      provide: STRING_MULTI_TOKEN,
      // @ts-expect-error
      useValue: [{}],
    });

    provide({
      provide: STRING_MULTI_TOKEN,
      // @ts-expect-error
      useValue: [''],
    });
    provide({
      provide: STRING_MULTI_TOKEN,
      useValue: '',
    });
  });
});

describe('useFactory', () => {
  it('provide', () => {
    provide({
      provide: STRING_TOKEN,
      // @ts-expect-error
      useFactory: () => 0,
    });

    provide({
      provide: STRING_TOKEN,
      // @ts-expect-error
      useFactory: () => {},
    });

    provide({
      provide: STRING_TOKEN,
      useFactory: () => '',
    });
  });

  it('provide deps', () => {
    provide({
      provide: NUMBER_TOKEN,
      useFactory: ({ a, b }) => {
        expectTypeOf(a).toEqualTypeOf<string>();
        expectTypeOf(b).toEqualTypeOf<{ a: { b: string; c: number }; d: boolean } | null>();

        return Number(a) + (b?.a.c ?? 0);
      },
      deps: {
        a: STRING_TOKEN,
        b: { token: OBJECT_TOKEN, optional: true },
      },
    });
  });

  it('deps with optional helper', () => {
    provide({
      provide: NUMBER_TOKEN,
      useFactory: ({ a, b }) => {
        expectTypeOf(a).toEqualTypeOf<string>();
        expectTypeOf(b).toEqualTypeOf<{ a: { b: string; c: number }; d: boolean } | null>();

        return Number(a) + (b?.a.c ?? 0);
      },
      deps: {
        a: STRING_TOKEN,
        b: optional(OBJECT_TOKEN),
      },
    });
  });

  it('external factory without deps', () => {
    const factory = () => 'string';

    provide({
      provide: NUMBER_TOKEN,
      // @ts-expect-error
      useFactory: factory,
    });

    provide({
      provide: STRING_TOKEN,
      useFactory: factory,
      deps: {
        a: NUMBER_TOKEN,
      },
    });

    provide({
      provide: STRING_TOKEN,
      useFactory: factory,
    });
  });

  it('external factory with deps', () => {
    const factory = ({ a, b }: { a: number; b: boolean }) => {
      return `${a}${b}`;
    };

    // @ts-expect-error
    provide({
      provide: STRING_TOKEN,
      useFactory: factory,
    });

    provide({
      provide: STRING_TOKEN,
      // @ts-expect-error
      useFactory: factory,
      deps: {},
    });

    provide({
      provide: STRING_TOKEN,
      // @ts-expect-error
      useFactory: factory,
      deps: {
        a: NUMBER_TOKEN,
      },
    });

    provide({
      provide: STRING_TOKEN,
      // @ts-expect-error
      useFactory: factory,
      deps: {
        a: NUMBER_TOKEN,
        b: optional(BOOLEAN_TOKEN),
      },
    });

    provide({
      provide: STRING_TOKEN,
      // @ts-expect-error
      useFactory: factory,
      deps: {
        a: NUMBER_TOKEN,
        b: STRING_TOKEN,
      },
    });

    provide({
      provide: STRING_TOKEN,
      useFactory: factory,
      deps: {
        a: NUMBER_TOKEN,
        b: BOOLEAN_TOKEN,
      },
    });
  });

  describe('multi tokens', () => {
    it('provide', () => {
      provide({
        provide: STRING_MULTI_TOKEN,
        // @ts-expect-error
        useFactory: () => 0,
      });
      provide({
        provide: STRING_MULTI_TOKEN,
        // @ts-expect-error
        useFactory: () => [0],
      });

      provide({
        provide: STRING_MULTI_TOKEN,
        // @ts-expect-error
        useFactory: () => {},
      });
      provide({
        provide: STRING_MULTI_TOKEN,
        // @ts-expect-error
        useFactory: () => [{}],
      });

      provide({
        provide: STRING_MULTI_TOKEN,
        // @ts-expect-error
        useFactory: () => [''],
      });
      provide({
        provide: STRING_MULTI_TOKEN,
        useFactory: () => '',
      });
    });

    it('provide deps', () => {
      provide({
        provide: STRING_MULTI_TOKEN,
        useFactory: ({ a, b }) => {
          expectTypeOf(a).toEqualTypeOf<string[]>();
          expectTypeOf(b).toEqualTypeOf<string[] | null>();

          return '';
        },
        deps: {
          a: STRING_MULTI_TOKEN,
          b: { token: STRING_MULTI_TOKEN, optional: true },
        },
      });
    });

    it('deps with optional helper', () => {
      provide({
        provide: STRING_MULTI_TOKEN,
        useFactory: ({ a, b }) => {
          expectTypeOf(a).toEqualTypeOf<string[]>();
          expectTypeOf(b).toEqualTypeOf<string[] | null>();

          return '';
        },
        deps: {
          a: STRING_MULTI_TOKEN,
          b: optional(STRING_MULTI_TOKEN),
        },
      });
    });
  });
});

describe('useClass', () => {
  type Interface = ExtractTokenType<typeof OBJECT_TOKEN>;

  it('external without deps', () => {
    class Test implements Interface {
      a: Interface['a'];
      d: Interface['d'];

      constructor() {
        this.a = {
          b: 'str',
          c: 3,
        };
        this.d = false;
      }
    }

    provide({
      provide: OBJECT_TOKEN,
      useClass: Test,
    });

    provide({
      provide: STRING_TOKEN,
      // @ts-expect-error
      useClass: Test,
    });

    provide({
      provide: OBJECT_TOKEN,
      useClass: Test,
      deps: {},
    });

    provide({
      provide: OBJECT_TOKEN,
      useClass: Test,
      deps: {
        a: NUMBER_TOKEN,
      },
    });
  });

  it('external with deps', () => {
    class Test implements Interface {
      a: Interface['a'];
      d: Interface['d'];

      constructor({ b, c, d }: { b: string; c: number; d: boolean }) {
        this.a = {
          b,
          c,
        };
        this.d = d;
      }
    }

    // @ts-expect-error
    provide({
      provide: OBJECT_TOKEN,
      useClass: Test,
    });

    provide({
      provide: OBJECT_TOKEN,
      // @ts-expect-error
      useClass: Test,
      deps: {},
    });

    provide({
      provide: OBJECT_TOKEN,
      // @ts-expect-error
      useClass: Test,
      deps: {
        b: STRING_TOKEN,
        c: STRING_TOKEN,
        d: STRING_TOKEN,
      },
    });

    provide({
      provide: OBJECT_TOKEN,
      // @ts-expect-error
      useClass: Test,
      deps: {
        b: STRING_TOKEN,
        c: optional(NUMBER_TOKEN),
        d: BOOLEAN_TOKEN,
      },
    });

    provide({
      provide: OBJECT_TOKEN,
      useClass: Test,
      deps: {
        b: STRING_TOKEN,
        c: NUMBER_TOKEN,
        d: BOOLEAN_TOKEN,
      },
    });
  });

  it('external multi', () => {
    class Test implements Interface {
      a: Interface['a'];
      d: Interface['d'];

      constructor({ b, c, d }: { b: string[]; c: number[] | null; d: boolean }) {
        this.a = {
          b: b[0],
          c: c?.[0] ?? 5,
        };
        this.d = d;
      }
    }

    provide({
      provide: OBJECT_TOKEN,
      // @ts-expect-error
      useClass: Test,
      deps: {
        b: STRING_TOKEN,
        c: STRING_TOKEN,
        d: STRING_TOKEN,
      },
    });

    provide({
      provide: OBJECT_TOKEN,
      // @ts-expect-error
      useClass: Test,
      deps: {},
    });

    provide({
      provide: OBJECT_TOKEN,
      // @ts-expect-error
      useClass: Test,
      deps: {
        b: STRING_MULTI_TOKEN,
        c: optional(NUMBER_TOKEN),
        d: BOOLEAN_TOKEN,
      },
    });

    provide({
      provide: OBJECT_TOKEN,
      useClass: Test,
      deps: {
        b: STRING_MULTI_TOKEN,
        c: optional(NUMBER_MULTI_TOKEN),
        d: BOOLEAN_TOKEN,
      },
    });
  });
});

/* eslint-enable jest/expect-expect */
