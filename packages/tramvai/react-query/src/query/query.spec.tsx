/**
 * @jest-environment jsdom
 */
import type { ReactElement } from 'react';
import { testHook } from '@tramvai/test-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createToken, provide } from '@tinkoff/dippy';
import { createQuery } from './create';
import { useQuery } from './use';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: Infinity,
    },
  },
});

const Wrapper = ({ children }: { children: ReactElement }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

const mockKey = jest.fn();
const mockRequest = jest.fn();

beforeEach(() => {
  mockKey.mockClear();
  mockRequest.mockClear();
});

it('simple case', async () => {
  const query = createQuery({
    key: 'test',
    async fn() {
      mockRequest(this.deps);
      return '';
    },
  });

  const { result, waitFor } = testHook(() => useQuery(query), {
    renderOptions: { wrapper: Wrapper },
  });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(mockRequest).toHaveBeenLastCalledWith({});
});

describe('deps', () => {
  const NUMBER_TOKEN = createToken<number>();
  const STRING_TOKEN = createToken<string>();

  it('resolvedDeps', async () => {
    const query = createQuery({
      key() {
        mockKey(this.deps);
        return `num: ${this.deps.num}, str: ${this.deps.str}`;
      },
      async fn() {
        mockRequest(this.deps);
        return '';
      },
      deps: {
        num: NUMBER_TOKEN,
        str: STRING_TOKEN,
      },
    });

    const { result, waitFor } = testHook(() => useQuery(query), {
      renderOptions: { wrapper: Wrapper },
      providers: [
        provide({
          provide: NUMBER_TOKEN,
          useValue: 333,
        }),
        provide({
          provide: STRING_TOKEN,
          useValue: 'test-str',
        }),
      ],
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockKey).toHaveBeenLastCalledWith({ num: 333, str: 'test-str' });
    expect(mockRequest).toHaveBeenLastCalledWith({ num: 333, str: 'test-str' });
  });
});
