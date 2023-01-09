import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { DefaultOptions } from '@tanstack/react-query';
import type { StorybookDecorator } from '../types';

export interface ReactQueryDecoratorParameters {
  tramvai?: {
    reactQueryDefaultOptions?: DefaultOptions;
  };
}

export const ReactQueryDecorator: StorybookDecorator<ReactQueryDecoratorParameters> = (
  Story,
  { parameters }: { parameters: ReactQueryDecoratorParameters }
) => {
  const queryClient = new QueryClient({
    defaultOptions: parameters.tramvai?.reactQueryDefaultOptions ?? {
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
