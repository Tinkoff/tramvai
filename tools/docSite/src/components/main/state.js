import React from 'react';
import { Section } from './section';
import { Code } from '../code';

const code = `import {
  createReducer,
  createEvent,
  useSelector,
  useActions
} from '@tramvai/state';

const incrementAction = createEvent('increment');

const countReducer = createReducer('count', 0)
  .on(incrementAction, (state) => state + 1);

const Component = () => {
  const count = useSelector('count', (state) => state);
  const increment = useActions(incrementAction);

  return (
    <div>
      <div>{count}</div>
      <button onClick={increment}>+</button>
    </div>
  );
}`;

export function State() {
  return (
    <Section
      left={
        <>
          <h3>
              Effective state management
          </h3>
          <ul>
            <li>
              Redux-like library
            </li>
            <li>
              Decentralized mechanism for subscriptions to changes
            </li>
            <li>
              Lack of boilerplate code
            </li>
            <li>
              Redux DevTools support
            </li>
          </ul>
        </>
      }
      right={<Code language="jsx">{code}</Code>}
    />
  );
}
