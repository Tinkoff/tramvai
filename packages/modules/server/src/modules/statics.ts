import { resolve } from 'path';
import FastifyStatic from '@fastify/static';
import { Module, provide } from '@tramvai/core';
import { SERVER_MODULE_STATICS_OPTIONS } from '@tramvai/tokens-server';
import { WEB_FASTIFY_APP_BEFORE_INIT_TOKEN } from '@tramvai/tokens-server-private';

const ONE_YEAR = 365 * 24 * 60 * 60;

@Module({
  providers: [
    provide({
      provide: WEB_FASTIFY_APP_BEFORE_INIT_TOKEN,
      useFactory: ({ options }): typeof WEB_FASTIFY_APP_BEFORE_INIT_TOKEN[number] => {
        const path = options?.path || 'public';

        return (instance) => {
          instance.register(FastifyStatic, {
            decorateReply: false,
            prefix: `/${path}`,
            root: resolve(process.cwd(), path),

            setHeaders: (res) => {
              const oneYearForward = new Date(Date.now() + ONE_YEAR * 1000);

              res.setHeader('cache-control', `public, max-age=${ONE_YEAR}`);
              res.setHeader('expires', oneYearForward.toUTCString());
            },
          });
        };
      },
      deps: {
        options: {
          token: SERVER_MODULE_STATICS_OPTIONS,
          optional: true,
        },
      },
      multi: true,
    }),
  ],
})
export class ServerStaticsModule {}
