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
class LoggerModule {}`;

export function Modular() {
  return (
    <Section
      left={
        <>
          <h3>
            <Translate id="MainPage.Modular.h3">
              Модульный
            </Translate>
          </h3>
          <ul>
            <li>
              <Translate id="MainPage.Modular.featureModules">
                Широкие возможности встроенных модулей
              </Translate>
            </li>
            <li>
              <Translate id="MainPage.Modular.featureExtendability">
                Элементарное добавление нового функционала
              </Translate>
            </li>
          </ul>
        </>
      }
      right={<Code language="js">{code}</Code>}
    />
  );
}
