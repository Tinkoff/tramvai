import { Module, provide } from '@tramvai/core';
import { QUERY_CLIENT_TOKEN } from '@tramvai/module-react-query';
import { DevToolsModule, DEV_TOOLS_GUI_ELEMENT_TOKEN } from '@tramvai/module-dev-tools';
import { devtoolsPanelFactory } from './devtoolsPanelFactory';

@Module({
  imports: [DevToolsModule],
  providers: [
    provide({
      provide: DEV_TOOLS_GUI_ELEMENT_TOKEN,
      multi: true,
      useFactory: devtoolsPanelFactory,
      deps: {
        queryClient: QUERY_CLIENT_TOKEN,
      },
    }),
  ].filter(Boolean),
})
export class ReactQueryDevtoolsModule {}
