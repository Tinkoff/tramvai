import { Module, commandLineListTokens, provide } from '@tramvai/core';
import { REQUEST_MANAGER_TOKEN, CONTEXT_TOKEN } from '@tramvai/tokens-common';
import { setRequest } from './RequestManagerStore';
import { sharedProviders } from './sharedProviders';

@Module({
  providers: [
    ...sharedProviders,
    provide({
      provide: commandLineListTokens.customerStart,
      multi: true,
      useFactory: ({ context, requestManager }) => {
        return function dehydrateRequestManager() {
          return context.dispatch(
            setRequest({
              body: requestManager.getBody(),
              headers: {
                'x-real-ip': requestManager.getClientIp(),
              },
            })
          );
        };
      },
      deps: {
        context: CONTEXT_TOKEN,
        requestManager: REQUEST_MANAGER_TOKEN,
      },
    }),
  ],
})
export class RequestManagerModule {}
