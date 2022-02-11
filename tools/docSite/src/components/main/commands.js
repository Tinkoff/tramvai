import React from 'react';
import { Section } from './section';
import { Code } from '../code';

const code = `@Module({
  providers: [
    {
      provide: commandLineListTokens.resolvePageDeps,
      useFactory: ({ logger }) => () => {
        logger.info('Fetch page data');
      },
      deps: {
        logger: 'logger'
      }
      multi: true
    }
  ]
})
export class CommandLineLoggingModule {}`;

export function Commands() {
  return (
    <Section
      left={
        <>
          <h3>
            Chain of commands
          </h3>
          <ul>
            <li>
              The ability to add an action to each stage of the application
            </li>
            <li>
              Parallel execution of actions at each stage for maximum efficiency
            </li>
          </ul>
        </>
      }
      right={<Code language="js">{code}</Code>}
    />
  );
}
