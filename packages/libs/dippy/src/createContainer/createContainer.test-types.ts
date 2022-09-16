import { expectTypeOf } from 'expect-type';
import type { BaseTokenInterface, TokenInterface } from '../createToken/createToken';
import { Container } from '../Container';
import { createToken } from '../createToken/createToken';

describe('Container types', () => {
  it('should correctly resolve generic types for token', () => {
    function resolveDi<T>(di: Container, token: BaseTokenInterface<T>): T {
      return di.get(token);
    }
    const di = new Container();
    const TOKEN = createToken<number>('num');

    const d = resolveDi(di, TOKEN);

    expectTypeOf(d).toEqualTypeOf<number>();
  });

  it('should correctly resolve generic types for opt dependency', () => {
    function resolveDi<T>(
      di: Container,
      dep: { token: TokenInterface<T>; optional: boolean }
    ): T | null {
      return di.get(dep);
    }

    const di = new Container();
    const TOKEN = createToken<number>('num');

    const d = resolveDi(di, { token: TOKEN, optional: true });

    expectTypeOf(d).toEqualTypeOf<number | null>();
  });

  it('should resolve multi token type', () => {
    const di = new Container();
    const MTOKEN = createToken<number>('numbers', { multi: true });

    const resolved = di.get(MTOKEN);

    expectTypeOf(resolved).toEqualTypeOf<number[]>();
  });

  it('should resolve any to any', () => {
    const di = new Container();
    const TOKEN = createToken<any>('num');

    const resolved = di.get(TOKEN);

    expectTypeOf(resolved).toEqualTypeOf<any>();
  });

  it('should resolve any multi token to any', () => {
    const di = new Container();
    const TOKEN = createToken<any>('num', { multi: true });

    const resolved = di.get(TOKEN);

    // @todo: should be any[] or not?
    expectTypeOf(resolved).toEqualTypeOf<any>();
  });
});
