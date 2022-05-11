import { QueryClient, QueryClientProvider } from 'react-query';
import type { DefaultOptions } from 'react-query';

export interface ReactQueryDecoratorParameters {
  reactQueryDefaultOptions?: DefaultOptions;
}

export const ReactQueryDecorator = (
  Story,
  { parameters }: { parameters: ReactQueryDecoratorParameters }
) => {
  const queryClient = new QueryClient({
    defaultOptions: parameters.reactQueryDefaultOptions ?? {
      queries: {
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};
