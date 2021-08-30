import React from 'react';
import { Section } from './section';

export function Performance() {
  return (
    <Section
      left={
        <>
          <h3>Производительный</h3>
          <ul>
            <li>Минимальный размер фреймворка</li>
            <li>Лучшие практики для загрузки клиентского кода</li>
            <li>Готовые модули для сбора метрик на сервере и клиенте</li>
          </ul>
        </>
      }
    />
  );
}
