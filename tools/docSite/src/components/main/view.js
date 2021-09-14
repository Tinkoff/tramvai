import React from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import { Section } from './section';

export function View() {
  return (
    <Section
      left={
        <>
          <h3>React</h3>
          <ul>
            <li>
              {translate({
                id: "MainPage.View.featureModernReact.description",
                message: "Поддержка современных возможностей библиотеки"
              })}{' '}(
              <a
                href="https://reactjs.org/docs/concurrent-mode-intro.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Concurrent Mode
              </a>
              )
            </li>
            <li>
              {translate({
                id: "MainPage.View.featureFastRefresh.description",
                message: "Первоклассный developer experience вместе с"
              })}{' '}
              <a
                href="https://reactnative.dev/docs/fast-refresh"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fast Refresh
              </a>
            </li>
            <li>
              <Translate id="MainPage.View.featureLayout">
                Гибкий механизм построения макета страницы
              </Translate>
            </li>
          </ul>
        </>
      }
    />
  );
}
