/* eslint-disable jest/expect-expect */
import { expectTypeOf } from 'expect-type';
import type { ExtractTokenType, ExtractDependencyType } from './createToken';
import { createToken } from './createToken';

describe('createToken', () => {
  it('token with primitive type', () => {
    const TOKEN = createToken<string>('');

    expectTypeOf(TOKEN).toEqualTypeOf<string>();
    expectTypeOf<ExtractTokenType<typeof TOKEN>>().toEqualTypeOf<string>();
    expectTypeOf<ExtractDependencyType<typeof TOKEN>>().toEqualTypeOf<string>();
  });

  it('token with object type', () => {
    const TOKEN = createToken<{ foo: string }>('');

    expectTypeOf(TOKEN).toHaveProperty('foo').toBeString();
    expectTypeOf<ExtractTokenType<typeof TOKEN>>().toHaveProperty('foo').toBeString();
    expectTypeOf<ExtractDependencyType<typeof TOKEN>>(TOKEN).toHaveProperty('foo').toBeString();
  });

  it('multi token with primitive type', () => {
    const TOKEN = createToken<number>('', { multi: true });

    expectTypeOf(TOKEN).toEqualTypeOf<number>();
    expectTypeOf<ExtractTokenType<typeof TOKEN>>().toEqualTypeOf<number>();
    expectTypeOf<ExtractDependencyType<typeof TOKEN>>().toEqualTypeOf<number[]>();
  });

  it('multi token with object type', () => {
    const TOKEN = createToken<{ foo: string }>('', { multi: true });

    expectTypeOf(TOKEN).toHaveProperty('foo').toBeString();
    expectTypeOf<ExtractTokenType<typeof TOKEN>>().toHaveProperty('foo').toBeString();
    expectTypeOf<ExtractDependencyType<typeof TOKEN>[0]>().toHaveProperty('foo').toBeString();
  });

  it('multi token should not act as distributive conditional types', () => {
    const TOKEN = createToken<boolean>('', { multi: true });

    expectTypeOf<ExtractDependencyType<typeof TOKEN>>().toEqualTypeOf<boolean[]>();
  });

  it('any token', () => {
    const TOKEN = createToken<any>('');

    expectTypeOf(TOKEN).toBeAny();
  });

  it('any token resolve dependency type', () => {
    const TOKEN = createToken<any>('');

    type ResolvedType = ExtractTokenType<typeof TOKEN>;

    expectTypeOf<ResolvedType>().toBeAny();
  });

  it('any token extract dependency type', () => {
    const TOKEN = createToken<any>('');

    type ExtractedType = ExtractDependencyType<typeof TOKEN>;

    expectTypeOf<ExtractedType>().toBeAny();
  });
});
/* eslint-enable jest/expect-expect */
