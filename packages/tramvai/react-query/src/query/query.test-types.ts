import { createQuery } from './create';
import { useQuery } from './use';

const expectType = <T>(value: T) => {};

describe('react-query/query', () => {
  it('no parameters', async () => {
    const query = createQuery({
      key: 'test',
      fn: async () => {},
    });

    const { data } = useQuery(query);

    expectType<void>(data);
  });

  it('specified parameter', async () => {
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

    expectType<number | undefined>(data);
  });
});
