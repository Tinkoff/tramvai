import React from 'react';
import Translate from '@docusaurus/Translate';
import { Code } from '../code';
import { BaseLink } from '../base-link';

const code = `$ npm install -g @tramvai/cli
$ tramvai new new-app
$ cd new-app && npm start`;

export function QuickStart() {
  return (
    <div className="row padding--lg main-section">
      <div className="col col--4 col--offset-4">
        <h3 className="text--center">
          <Translate id="MainPage.QuickStart.h3">
            Быстрый старт
          </Translate>
        </h3>
        <p className="text--center">
          <Translate id="MainPage.QuickStart.description">
            Для создания, разработки и сборки приложения создана мощная и функциональная CLI
          </Translate>
        </p>
        <Code language="sh">{code}</Code>
        <div className="text--center">
          <BaseLink to="docs/get-started/create-app">
            <Translate id="MainPage.QuickStart.getStartedLink">
              Начало работы
            </Translate>
          </BaseLink>
        </div>
      </div>
    </div>
  );
}
