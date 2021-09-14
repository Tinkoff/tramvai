import React from 'react';
import Translate from '@docusaurus/Translate';
import { Section } from './section';

export function Performance() {
  return (
    <Section
      left={
        <>
          <h3>
            <Translate id="MainPage.Performance.h3">
              Производительный
            </Translate>
          </h3>
          <ul>
            <li>
              <Translate id="MainPage.Performance.featureSize">
                Минимальный размер фреймворка
              </Translate>
            </li>
            <li>
              <Translate id="MainPage.Performance.featureBestPractice">
                Лучшие практики для загрузки клиентского кода
              </Translate>
            </li>
            <li>
              <Translate id="MainPage.Performance.featureMetrics">
                Готовые модули для сбора метрик на сервере и клиенте
              </Translate>
            </li>
          </ul>
        </>
      }
    />
  );
}
