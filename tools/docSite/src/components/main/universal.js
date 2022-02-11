import React from 'react';
import { Section } from './section';

export function Universal() {
  return (
    <Section
      left={
        <>
          <h3>
            Universal
          </h3>
          <ul>
            <li>
              Application rendering on the server and hydration on the client
            </li>
            <li>
              Full control over data fetching
            </li>
            <li>
              Safe execution of server and client code
            </li>
          </ul>
        </>
      }
    />
  );
}
