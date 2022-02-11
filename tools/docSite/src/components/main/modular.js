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
class LoggerModule {}`;

export function Modular() {
  return (
    <Section
      left={
        <>
          <h3>
            Modular
          </h3>
          <ul>
            <li>
              Wide possibilities of built-in modules
            </li>
            <li>
              Easy extends by new functionality
            </li>
          </ul>
        </>
      }
      right={<Code language="js">{code}</Code>}
    />
  );
}
