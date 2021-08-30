import React from 'react';
import { Section } from './section';

export function View() {
  return (
    <Section
      left={
        <>
          <h3>React</h3>
          <ul>
            <li>
              Поддержка современных возможностей библиотеки (
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
              Первоклассный developer experience вместе с{' '}
              <a
                href="https://reactnative.dev/docs/fast-refresh"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fast Refresh
              </a>
            </li>
            <li>Гибкий механизм построения макета страницы</li>
          </ul>
        </>
      }
    />
  );
}
