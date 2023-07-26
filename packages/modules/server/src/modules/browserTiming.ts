import { declareModule, provide } from '@tramvai/core';
import { COMMAND_LINE_EXECUTION_END_TOKEN } from '@tramvai/tokens-core-private';

export const BrowserTimingModule = declareModule({
  name: 'BrowserTiming',
  providers: [
    provide({
      provide: COMMAND_LINE_EXECUTION_END_TOKEN,
      multi: true,
      useValue: (di, type, status, timingInfo) => {
        Object.keys(timingInfo).forEach((line) => {
          const { start, end } = timingInfo[line];
          const name = `command-line:${line}`;
          const startName = `${name}:start`;
          const endName = `${name}:end`;

          performance.mark(startName, { startTime: start });
          performance.mark(endName, { startTime: end });

          performance.measure(name, startName, endName);

          performance.clearMarks(startName);
          performance.clearMarks(endName);

          // special wark between `spa_transition` end and `after_spa_transition` start - in most ways it will be React rerender time
          if (line === 'spa_transition') {
            performance.mark('spa-render-start', { startTime: end });
          } else if (line === 'after_spa_transition') {
            performance.mark('spa-render-end', { startTime: start });

            performance.measure('tramvai:spa-render', 'spa-render-start', 'spa-render-end');

            performance.clearMarks('spa-render-start');
            performance.clearMarks('spa-render-end');
          }
        });
      },
    }),
  ],
});
