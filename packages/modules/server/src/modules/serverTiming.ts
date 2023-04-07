import { declareModule, provide } from '@tramvai/core';
import { COMMAND_LINE_EXECUTION_END_TOKEN } from '@tramvai/tokens-core-private';
import { RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';
import { FASTIFY_RESPONSE } from '@tramvai/tokens-server-private';

export const ServerTimingModule = declareModule({
  name: 'ServerTiming',
  providers: [
    provide({
      provide: COMMAND_LINE_EXECUTION_END_TOKEN,
      multi: true,
      useValue: (di, type, status, timingInfo) => {
        if (type === 'server' && status === 'customer') {
          const responseManager = di.get(RESPONSE_MANAGER_TOKEN);
          const reply = di.get(FASTIFY_RESPONSE);

          // prevent unnecessary work
          if (reply.sent) {
            return;
          }

          const initialHeader = (responseManager.getHeader('Server-Timing') as string) ?? '';
          const entries: string[] = [];
          // index for custom sort
          let index = 0;

          for (const line in timingInfo) {
            const info = timingInfo[line];

            entries.push(`line_${index++}_${line};dur=${info.end - info.start}`);
          }

          responseManager.setHeader(
            'Server-Timing',
            `${initialHeader ? `${initialHeader}, ` : ''}${entries.join(', ')}`
          );
        }
      },
    }),
  ],
});
