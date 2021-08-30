import { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/tokens-server';
import { DI_TOKEN } from '@tinkoff/dippy';
import { Module, provide } from '@tramvai/core';
import { depsGraph } from './papi/deps-graph';

@Module({
  providers:
    process.env.NODE_ENV === 'development'
      ? [
          provide({
            provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
            multi: true,
            useFactory: depsGraph,
            deps: {
              di: DI_TOKEN,
            },
          }),
        ]
      : [],
})
export class DepsGraphModule {}
