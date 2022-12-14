/**
 * @jest-environment jsdom
 */
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { testHook } from '@tramvai/test-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createToken, provide } from '@tinkoff/dippy';
import { createMutation } from './create';
import { useMutation } from './use';

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
  const mutation = createMutation({
    key: 'test',
    async fn() {
      mockRequest(this.deps);
      return 'response';
    },
  });

  const { result, waitFor } = testHook(
    () => {
      const mut = useMutation(mutation);
      const [response, setResponse] = useState<string>('');

      const callback = useCallback(() => {
        mut.mutateAsync({}).then((res) => {
          setResponse(res);
        });
      }, [mut]);

      return {
        callback,
        response,
      };
    },
    {
      renderOptions: { wrapper: Wrapper },
    }
  );

  result.current.callback();

  await waitFor(() => expect(result.current.response).toBe('response'));

  expect(mockRequest).toHaveBeenLastCalledWith({});
});

describe('deps', () => {
  const NUMBER_TOKEN = createToken<number>();
  const STRING_TOKEN = createToken<string>();

  it('resolvedDeps', async () => {
    const mutation = createMutation({
      key() {
        mockKey(this.deps);
        return `num: ${this.deps.num}, str: ${this.deps.str}`;
      },
      async fn() {
        mockRequest(this.deps);
        return 'response';
      },
      deps: {
        num: NUMBER_TOKEN,
        str: STRING_TOKEN,
      },
    });

    const { result, waitFor } = testHook(
      () => {
        const mut = useMutation(mutation);
        const [response, setResponse] = useState<string>('');

        const callback = useCallback(() => {
          mut.mutateAsync({}).then((res) => {
            setResponse(res);
          });
        }, [mut]);

        return {
          callback,
          response,
        };
      },
      {
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
      }
    );

    result.current.callback();

    await waitFor(() => expect(result.current.response).toBe('response'));

    expect(mockKey).toHaveBeenLastCalledWith({ num: 333, str: 'test-str' });
    expect(mockRequest).toHaveBeenLastCalledWith({ num: 333, str: 'test-str' });
  });
});
