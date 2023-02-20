import React from 'react';
import { Code } from '../code';
import { BaseLink } from '../base-link';

const code = `$ npm init @tramvai@latest new-app
$ cd new-app && npm start`;

export function QuickStart() {
  return (
    <div className="row padding--lg main-section">
      <div className="col col--4 col--offset-4">
        <h3 className="text--center">
          Quick start
        </h3>
        <p className="text--center">
          Powerful and functional CLI to create, develop and build applications
        </p>
        <Code language="sh">{code}</Code>
        <div className="text--center">
          <BaseLink to="docs/get-started/quick-start">
            Get started
          </BaseLink>
        </div>
      </div>
    </div>
  );
}
