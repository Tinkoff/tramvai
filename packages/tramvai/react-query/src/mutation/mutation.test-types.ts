import { createToken } from '@tinkoff/dippy';
import { expectTypeOf } from 'expect-type';
import { createMutation } from './create';
import { useMutation } from './use';

describe('parameters', () => {
  it('no parameters', () => {
    const mutation = createMutation({
      key: 'test',
      fn: async () => {},
    });

    const { data } = useMutation(mutation);

    expectTypeOf(data).toBeVoid();
  });

  it('specified parameter', () => {
    const mutation = createMutation({
      key: 'test',
      fn: async (param?: string) => {
        return 25;
      },
    });

    // @ts-expect-error
    useMutation(mutation, 5);
    // @ts-expect-error
    useMutation(mutation, {});

    const { data } = useMutation(mutation, 'test');

    expectTypeOf(data).toEqualTypeOf<number | undefined>();
  });
});

describe('deps', () => {
  const NUMBER_TOKEN = createToken<number>();
  const STRING_TOKEN = createToken<string>();

  it('use deps in key and fn', () => {
    createMutation({
      key() {
        expectTypeOf(this.deps).toEqualTypeOf({});
        return '';
      },
      async fn() {
        expectTypeOf(this.deps).toEqualTypeOf({});
        return '';
      },
    });

    createMutation({
      key() {
        expectTypeOf(this.deps).toEqualTypeOf<{
          num: number;
          str: string;
        }>();
        return '';
      },
      async fn() {
        expectTypeOf(this.deps).toEqualTypeOf<{
          num: number;
          str: string;
        }>();
        return '';
      },
      deps: {
        num: NUMBER_TOKEN,
        str: STRING_TOKEN,
      },
    });
  });
});
