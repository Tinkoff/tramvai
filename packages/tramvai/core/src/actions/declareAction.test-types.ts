import type { ExtractDependencyType } from '@tinkoff/dippy';
import { createToken } from '@tinkoff/dippy';
import { expectTypeOf } from 'expect-type';
import { declareAction } from './declareAction';

const NUMBER_TOKEN = createToken<number>('number');
const STRING_TOKEN = createToken<string>('string');
const OBJECT_TOKEN = createToken<{ a: string }>('object');

describe('declareAction.test-types', () => {
  it('should properly infer deps types', async () => {
    declareAction({
      name: 'test',
      fn() {
        expectTypeOf(this.deps).toEqualTypeOf({});
      },
    });

    declareAction({
      name: 'test',
      fn() {
        expectTypeOf(this.deps).toEqualTypeOf({});
      },
      deps: {},
    });

    declareAction({
      name: 'test',
      fn() {
        expectTypeOf(this.deps).toBeObject();
        expectTypeOf(this.deps.n).toBeNumber();
        expectTypeOf(this.deps.s).toBeString();
        expectTypeOf(this.deps.o).toEqualTypeOf<ExtractDependencyType<typeof OBJECT_TOKEN>>();
      },
      deps: {
        n: NUMBER_TOKEN,
        s: STRING_TOKEN,
        o: OBJECT_TOKEN,
      },
    });

    declareAction({
      name: 'test',
      fn() {
        expectTypeOf(this.deps).toBeObject();
        expectTypeOf(this.deps.n).toEqualTypeOf<number | null>();
        expectTypeOf(this.deps.s).toEqualTypeOf<string | null>();
        expectTypeOf(this.deps.o).toEqualTypeOf<ExtractDependencyType<
          typeof OBJECT_TOKEN
        > | null>();
      },
      deps: {
        n: { token: NUMBER_TOKEN, optional: true },
        s: { token: STRING_TOKEN, optional: true },
        o: { token: OBJECT_TOKEN, optional: true },
      },
    });
  });
});
