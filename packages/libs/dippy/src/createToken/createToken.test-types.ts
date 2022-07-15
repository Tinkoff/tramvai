/* eslint-disable jest/expect-expect */
import { provide } from '../provide';
import type { ExtractTokenType, ExtractDependencyType } from './createToken';
import { optional } from './createToken';
import { createToken } from './createToken';

type IsString<P> = P extends string ? 1 : 0;
type IsNumber<P> = P extends number ? 1 : 0;
type IsAny<P> = P extends never ? 1 : 0;
type IsNull<P> = P extends null ? 1 : 0;

describe('createToken', () => {
  it('token with primitive type', () => {
    const TOKEN = createToken<string>('');

    const extractRightTypeFromToken: IsString<ExtractTokenType<typeof TOKEN>> = 1;
    // @ts-expect-error
    const extractWrongTypeFromgToken: IsAny<ExtractTokenType<typeof TOKEN>> = 1;

    const extractRightTypeFromToken_asDeps: IsString<ExtractDependencyType<typeof TOKEN>> = 1;
    // @ts-expect-error
    const extractWrongTypeFromgToken_asDeps: IsAny<ExtractDependencyType<typeof TOKEN>> = 1;

    const extractRightTypeFromToken_typeof: IsString<typeof TOKEN> = 1;
    // @ts-expect-error
    const extractWrongTypeFromgToken_typeof: IsAny<typeof TOKEN> = 1;
  });

  it('token with object type', () => {
    const TOKEN = createToken<{ foo: string }>('');

    const extractRightTypeFromStringToken: IsString<ExtractTokenType<typeof TOKEN>['foo']> = 1;
    // @ts-expect-error
    const extractWrongTypeFromStringToken: IsAny<ExtractTokenType<typeof TOKEN>['foo']> = 1;

    const extractRightTypeFromStringToken_asDep: IsString<
      ExtractDependencyType<typeof TOKEN>['foo']
    > = 1;
    // @ts-expect-error
    const extractWrongTypeFromStringToken_asDep: IsAny<
      ExtractDependencyType<typeof TOKEN>['foo']
    > = 1;

    const extractRightTypeFromStringToken_typeof: IsString<typeof TOKEN['foo']> = 1;
    // @ts-expect-error
    const extractWrongTypeFromStringToken_typeof: IsAny<typeof TOKEN['foo']> = 1;
  });

  it('multi token with primitive type', () => {
    const TOKEN = createToken<number>('', { multi: true });

    const extractRightTypeFromToken: IsNumber<ExtractTokenType<typeof TOKEN>> = 1;
    // @ts-expect-error
    const extractWrongTypeFromToken: IsAny<ExtractTokenType<typeof TOKEN>> = 1;

    const extractRightTypeFromToken_asDep: IsNumber<
      ExtractDependencyType<typeof TOKEN>[number]
    > = 1;
    // @ts-expect-error
    const extractWrongTypeFromToken_asDep: IsAny<ExtractDependencyType<typeof TOKEN>[number]> = 1;

    const extractRightTypeFromToken_typeof: IsNumber<typeof TOKEN> = 1;
    // @ts-expect-error
    const extractWrongTypeFromToken_typeof: IsAny<typeof TOKEN> = 1;
  });

  it('multi token with object type', () => {
    const TOKEN = createToken<{ foo: string }>('', { multi: true });

    const extractRightTypeFromStringToken: IsString<ExtractTokenType<typeof TOKEN>['foo']> = 1;
    // @ts-expect-error
    const extractWrongTypeFromStringToken: IsAny<ExtractTokenType<typeof TOKEN>['foo']> = 1;

    const extractRightTypeFromStringToken_asDep: IsString<
      ExtractDependencyType<typeof TOKEN>[number]['foo']
    > = 1;
    // @ts-expect-error
    const extractWrongTypeFromStringToken_asDep: IsAny<
      ExtractDependencyType<typeof TOKEN>[number]['foo']
    > = 1;

    const extractRightTypeFromStringToken_typeof: IsString<typeof TOKEN['foo']> = 1;
    // @ts-expect-error
    const extractWrongTypeFromStringToken_typeof: IsAny<typeof TOKEN['foo']> = 1;
  });

  describe('provide with base token', () => {
    const TOKEN = createToken<string>('');

    it('useValue', () => {
      provide({
        provide: TOKEN,
        // @ts-expect-error
        useValue: 0,
      });

      provide({
        provide: TOKEN,
        // @ts-expect-error
        useValue: {},
      });

      provide({
        provide: TOKEN,
        useValue: '',
      });
    });

    it('useFactory', () => {
      provide({
        provide: TOKEN,
        // @ts-expect-error
        useFactory: () => 0,
      });

      provide({
        provide: TOKEN,
        // @ts-expect-error
        useFactory: () => {},
      });

      provide({
        provide: TOKEN,
        useFactory: () => '',
      });
    });

    it('useFactory deps', () => {
      provide({
        provide: TOKEN,
        useFactory: ({ a, b }) => {
          const extractRightTypeFromA: IsString<typeof a> = 1;
          // @ts-expect-error
          const extractWrongTypeFromA_1: IsAny<typeof a> = 1;
          // @ts-expect-error
          const extractWrongTypeFromA_2: IsNull<typeof a> = 1;

          const extractRightTypeFromB_1: IsString<typeof b> = 1;
          const extractRightTypeFromB_2: IsNull<typeof b> = 1;
          // @ts-expect-error
          const extractWrongTypeFromB: IsAny<typeof b> = 1;

          return a + b;
        },
        deps: {
          a: TOKEN,
          b: { token: TOKEN, optional: true },
        },
      });
    });

    it('useFactory deps with optional helper', () => {
      provide({
        provide: TOKEN,
        useFactory: ({ a, b }) => {
          const extractRightTypeFromA: IsString<typeof a> = 1;
          // @ts-expect-error
          const extractWrongTypeFromA_1: IsAny<typeof a> = 1;
          // @ts-expect-error
          const extractWrongTypeFromA_2: IsNull<typeof a> = 1;

          const extractRightTypeFromB_1: IsString<typeof b> = 1;
          const extractRightTypeFromB_2: IsNull<typeof b> = 1;
          // @ts-expect-error
          const extractWrongTypeFromB: IsAny<typeof b> = 1;

          return a + b;
        },
        deps: {
          a: TOKEN,
          b: optional(TOKEN),
        },
      });
    });
  });

  describe('provide with multi token', () => {
    const TOKEN = createToken<string>('', { multi: true });

    it('useValue', () => {
      provide({
        provide: TOKEN,
        // @ts-expect-error
        useValue: 0,
      });
      provide({
        provide: TOKEN,
        // @ts-expect-error
        useValue: [0],
      });

      provide({
        provide: TOKEN,
        // @ts-expect-error
        useValue: {},
      });
      provide({
        provide: TOKEN,
        // @ts-expect-error
        useValue: [{}],
      });

      provide({
        provide: TOKEN,
        // @ts-expect-error
        useValue: [''],
      });
      provide({
        provide: TOKEN,
        useValue: '',
      });
    });

    it('useFactory', () => {
      provide({
        provide: TOKEN,
        // @ts-expect-error
        useFactory: () => 0,
      });
      provide({
        provide: TOKEN,
        // @ts-expect-error
        useFactory: () => [0],
      });

      provide({
        provide: TOKEN,
        // @ts-expect-error
        useFactory: () => {},
      });
      provide({
        provide: TOKEN,
        // @ts-expect-error
        useFactory: () => [{}],
      });

      provide({
        provide: TOKEN,
        // @ts-expect-error
        useFactory: () => [''],
      });
      provide({
        provide: TOKEN,
        useFactory: () => '',
      });
    });

    it('useFactory deps', () => {
      provide({
        provide: TOKEN,
        useFactory: ({ a, b }) => {
          const extractRightTypeFromA: IsString<typeof a[number]> = 1;
          // @ts-expect-error
          const extractWrongTypeFromA_1: IsAny<typeof a[number]> = 1;
          // @ts-expect-error
          const extractWrongTypeFromA_2: IsNull<typeof a[number]> = 1;

          if (Array.isArray(b)) {
            const extractRightTypeFromB: IsString<typeof b[number]> = 1;
            // @ts-expect-error
            const extractWrongTypeFromB: IsAny<typeof b[number]> = 1;
          } else {
            const extractRightTypeFromB: IsNull<typeof b> = 1;
            // @ts-expect-error
            const extractWrongTypeFromB: IsAny<typeof b> = 1;
          }

          return '';
        },
        deps: {
          a: TOKEN,
          b: { token: TOKEN, optional: true },
        },
      });
    });

    it('useFactory deps with optional helper', () => {
      provide({
        provide: TOKEN,
        useFactory: ({ a, b }) => {
          const extractRightTypeFromA: IsString<typeof a[number]> = 1;
          // @ts-expect-error
          const extractWrongTypeFromA_1: IsAny<typeof a[number]> = 1;
          // @ts-expect-error
          const extractWrongTypeFromA_2: IsNull<typeof a[number]> = 1;

          if (Array.isArray(b)) {
            const extractRightTypeFromB: IsString<typeof b[number]> = 1;
            // @ts-expect-error
            const extractWrongTypeFromB: IsAny<typeof b[number]> = 1;
          } else {
            const extractRightTypeFromB: IsNull<typeof b> = 1;
            // @ts-expect-error
            const extractWrongTypeFromB: IsAny<typeof b> = 1;
          }

          return '';
        },
        deps: {
          a: TOKEN,
          b: optional(TOKEN),
        },
      });
    });
  });
});
/* eslint-enable jest/expect-expect */
