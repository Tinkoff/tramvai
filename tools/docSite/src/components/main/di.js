import React from 'react';
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
              Flexibility and reduced code cohesion
            </li>
            <li>
              Lazy initialization of dependencies
            </li>
          </ul>
        </>
      }
      right={<Code language="js">{code}</Code>}
    />
  );
}
