import type { ExtractDependencyType } from '@tramvai/core';
import { Module, provide, commandLineListTokens } from '@tramvai/core';
import { ENV_USED_TOKEN } from '@tramvai/tokens-common';
import { ENV_MANAGER_TOKEN } from '@tramvai/module-common';
import { SERVER_TOKEN } from '@tramvai/tokens-server';

@Module({
  providers: [
    provide({
      provide: ENV_USED_TOKEN,
      useValue: [
        {
          key: 'NODE_KEEPALIVE_TIMEOUT',
          optional: true,
          validator(keepAliveTimeout: string) {
            const value = Number(keepAliveTimeout);
            if (Number.isNaN(value)) {
              return 'Env variable NODE_KEEPALIVE_TIMEOUT should be a number';
            }
            if (value < 0) {
              return 'Env variable NODE_KEEPALIVE_TIMEOUT should be greater or equal than 0';
            }
            return true;
          },
        },
      ],
    }),
    provide({
      provide: commandLineListTokens.init,
      useFactory: ({
        server,
        envManager,
      }: {
        server: ExtractDependencyType<typeof SERVER_TOKEN>;
        envManager: ExtractDependencyType<typeof ENV_MANAGER_TOKEN>;
      }) => () => {
        const externalKeepAliveTimeout = envManager.get('NODE_KEEPALIVE_TIMEOUT');
        if (externalKeepAliveTimeout !== 'undefined') {
          // eslint-disable-next-line no-param-reassign
          server.keepAliveTimeout = Number(externalKeepAliveTimeout);
        }
      },
      multi: true,
      deps: { server: SERVER_TOKEN, envManager: ENV_MANAGER_TOKEN },
    }),
  ],
})
export class KeepAliveModule {}
