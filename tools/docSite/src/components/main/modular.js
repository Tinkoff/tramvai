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
          <h3>Модульный</h3>
          <ul>
            <li>Широкие возможности встроенных модулей</li>
            <li>Элементарное добавление нового функционала</li>
          </ul>
        </>
      }
      right={<Code language="js">{code}</Code>}
    />
  );
}
