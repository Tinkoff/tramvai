import { createToken } from '@tinkoff/dippy';
import { expectTypeOf } from 'expect-type';
import { createQuery } from './create';
import { useQuery } from './use';

describe('parameters', () => {
  it('no parameters', () => {
    const query = createQuery({
      key: 'test',
      fn: async () => {},
    });

    const { data } = useQuery(query);

    expectTypeOf(data).toBeVoid();
  });

  it('specified parameter', () => {
    const query = createQuery({
      key: 'test',
      fn: async (param: string) => {
        return 25;
      },
    });

    // @ts-expect-error
    useQuery(query);
    // @ts-expect-error
    useQuery(query, 5);
    // @ts-expect-error
    useQuery(query, {});

    const { data } = useQuery(query, 'test');

    expectTypeOf(data).toEqualTypeOf<number | undefined>();
  });
});

describe('deps', () => {
  const NUMBER_TOKEN = createToken<number>();
  const STRING_TOKEN = createToken<string>();

  it('use deps in key and fn', () => {
    createQuery({
      key() {
        expectTypeOf(this.deps).toEqualTypeOf({});
        return '';
      },
      async fn() {
        expectTypeOf(this.deps).toEqualTypeOf({});
        return '';
      },
    });

    createQuery({
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
