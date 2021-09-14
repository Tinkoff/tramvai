import React from 'react';
import Translate from '@docusaurus/Translate';
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
            <Translate id="MainPage.Commands.h3">
              Цепочка команд
            </Translate>
          </h3>
          <ul>
            <li>
              <Translate id="MainPage.Commands.featureChain">
                Возможность добавить действие на каждый этап работы приложения
              </Translate>
            </li>
            <li>
              <Translate id="MainPage.Commands.featureParallel">
                Параллельное выполнение действий на каждом этапе для максимальной эффективности
              </Translate>
            </li>
          </ul>
        </>
      }
      right={<Code language="js">{code}</Code>}
    />
  );
}
