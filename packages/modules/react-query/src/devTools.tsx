import React from 'react';
import { Module, provide } from '@tramvai/core';
import { QueryClientProvider } from 'react-query';
import { QUERY_CLIENT_TOKEN } from './tokens';

let ReactQueryDevtoolsPanel: React.ElementType;
const DEVTOOLS_STYLES = { height: '100%' };

let DEV_TOOLS_GUI_ELEMENT_TOKEN;

try {
  ({ DEV_TOOLS_GUI_ELEMENT_TOKEN } = require('@tramvai/module-dev-tools'));
} catch {}

if (DEV_TOOLS_GUI_ELEMENT_TOKEN) {
  ({ ReactQueryDevtoolsPanel } = require('react-query/devtools'));
}

@Module({
  providers: [
    DEV_TOOLS_GUI_ELEMENT_TOKEN &&
      provide({
        provide: DEV_TOOLS_GUI_ELEMENT_TOKEN,
        multi: true,
        useFactory: ({ queryClient }) => {
          return {
            title: 'react-query',
            content: (
              <QueryClientProvider client={queryClient}>
                <ReactQueryDevtoolsPanel style={DEVTOOLS_STYLES} />
              </QueryClientProvider>
            ),
          };
        },
        deps: {
          queryClient: QUERY_CLIENT_TOKEN,
        },
      }),
  ].filter(Boolean),
})
export class ReactQueryDevtoolsModule {}
