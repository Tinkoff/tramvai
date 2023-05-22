import { commandLineListTokens, Module, provide } from '@tramvai/core';
import { CHILD_APP_PRELOAD_MANAGER_TOKEN } from '@tramvai/module-child-app';

@Module({
  providers: [
    provide({
      provide: commandLineListTokens.customerStart,
      multi: true,
      useFactory: ({ preloadManager }) => {
        return function preloadHeaderChildApp() {
          return preloadManager.preload({ name: 'footer' });
        };
      },
      deps: {
        preloadManager: CHILD_APP_PRELOAD_MANAGER_TOKEN,
      },
    }),
  ],
})
export class FooterModule {}
