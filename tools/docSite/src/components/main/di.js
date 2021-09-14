import React from 'react';
import Translate from '@docusaurus/Translate';
import { Section } from './section';
import { Code } from '../code';

const code = `import { Module } from '@tramvai/core';

@Module({
  providers: [{
    provide: 'logger',
    useValue: console
  }]
})
class LoggerModule {}

@Module({
  providers: [{
    provide: 'service',
    useFactory: (deps) => {
      return new Service({ logger: deps.logger });
    },
    deps: {
      logger: 'logger'
    }
  }]
})
class ServiceModule {}`;

export function DI() {
  return (
    <Section
      left={
        <>
          <h3>Dependency Injection</h3>
          <ul>
            <li>
              <Translate id="MainPage.DI.featureFlexibility">
                Гибкость и уменьшение связанности кода
              </Translate>
            </li>
            <li>
              <Translate id="MainPage.DI.featureLazy">
                Ленивая инициализация зависимостей
              </Translate>
            </li>
          </ul>
        </>
      }
      right={<Code language="js">{code}</Code>}
    />
  );
}
