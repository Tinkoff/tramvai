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
              Support for modern library features (
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
              First-class developer experience with{' '}
              <a
                href="https://reactnative.dev/docs/fast-refresh"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fast Refresh
              </a>
            </li>
            <li>
              Flexible mechanism for building a page layout
            </li>
          </ul>
        </>
      }
    />
  );
}
