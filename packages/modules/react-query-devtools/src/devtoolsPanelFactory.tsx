import { QueryClientProvider } from 'react-query';
import type { QUERY_CLIENT_TOKEN } from '@tramvai/module-react-query';
import type { DEV_TOOLS_GUI_ELEMENT_TOKEN } from '@tramvai/module-dev-tools';
import { ReactQueryDevtoolsPanel } from 'react-query/devtools';

const DEVTOOLS_STYLES = { height: '100%' };

export const devtoolsPanelFactory = ({
  queryClient,
}: {
  queryClient: typeof QUERY_CLIENT_TOKEN;
}): typeof DEV_TOOLS_GUI_ELEMENT_TOKEN => ({
  title: 'react-query',
  content: (
    <QueryClientProvider client={queryClient}>
      {/* @ts-expect-error */}
      <ReactQueryDevtoolsPanel style={DEVTOOLS_STYLES} />
    </QueryClientProvider>
  ),
});
