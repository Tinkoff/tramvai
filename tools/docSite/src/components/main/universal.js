import React from 'react';
import { Section } from './section';

export function Universal() {
  return (
    <Section
      left={
        <>
          <h3>Универсальный</h3>
          <ul>
            <li>Рендеринг приложения на сервере и гидрация на клиенте</li>
            <li>Полный контроль над получением данных</li>
            <li>Безопасное выполнение серверного и клиентского кода</li>
          </ul>
        </>
      }
    />
  );
}
