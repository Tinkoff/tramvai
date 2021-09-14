import type { InfiniteData } from 'react-query';
import { createInfiniteQuery } from './create';
import { useInfiniteQuery } from './use';

const expectType = <T>(value: T) => {};

describe('react-query/infiniteQuery', () => {
  it('no parameters', async () => {
    const query = createInfiniteQuery({
      key: 'test',
      fn: async () => {},
    });

    const { data } = useInfiniteQuery(query);

    expectType<InfiniteData<void> | undefined>(data);
  });

  it('specified parameter', async () => {
    const query = createInfiniteQuery({
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

    const { data } = useInfiniteQuery(query, 'test');

    expectType<InfiniteData<number> | undefined>(data);
  });
});
