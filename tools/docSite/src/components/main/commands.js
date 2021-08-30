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
          <h3>Цепочка команд</h3>
          <ul>
            <li>Возможность добавить действие на каждый этап работы приложения</li>
            <li>Параллельное выполнение действий на каждом этапе для максимальной эффективности</li>
          </ul>
        </>
      }
      right={<Code language="js">{code}</Code>}
    />
  );
}
