import React from 'react';
import Translate from '@docusaurus/Translate';
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
              <Translate id="MainPage.State.h3">
                Эффективное управление состоянием
              </Translate>
          </h3>
          <ul>
            <li>
              <Translate id="MainPage.State.featureRedux">
                Redux-like библиотека
              </Translate>
            </li>
            <li>
              <Translate id="MainPage.State.featureSubscribtions">
                Точечный механизм подписок на изменения
              </Translate>
            </li>
            <li>
              <Translate id="MainPage.State.featureBoilerplate">
                Отсутствие boilerplate кода
              </Translate>
            </li>
            <li>
              <Translate id="MainPage.State.featureDevTools">
                Поддержка Redux DevTools
              </Translate>
            </li>
          </ul>
        </>
      }
      right={<Code language="jsx">{code}</Code>}
    />
  );
}
