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
          <h3>Эффективное управление состоянием</h3>
          <ul>
            <li>Redux-like библиотека</li>
            <li>Точечный механизм подписок на изменения</li>
            <li>Отсутствие boilerplate кода</li>
            <li>Поддержка Redux DevTools</li>
          </ul>
        </>
      }
      right={<Code language="jsx">{code}</Code>}
    />
  );
}
