import React from 'react';
import { Section } from './section';

export function Performance() {
  return (
    <Section
      left={
        <>
          <h3>
            Fast
          </h3>
          <ul>
            <li>
              Minimum framework size
            </li>
            <li>
              Best practices for loading client code
            </li>
            <li>
              Modules for collecting metrics on the server and client
            </li>
          </ul>
        </>
      }
    />
  );
}
