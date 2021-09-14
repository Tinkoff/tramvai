import React from 'react';
import Translate from '@docusaurus/Translate';
import { Section } from './section';

export function Universal() {
  return (
    <Section
      left={
        <>
          <h3>
            <Translate id="MainPage.Universal.h3">
              Универсальный
            </Translate>
          </h3>
          <ul>
            <li>
              <Translate id="MainPage.Universal.featureSSR">
                Рендеринг приложения на сервере и гидрация на клиенте
              </Translate>
            </li>
            <li>
              <Translate id="MainPage.Universal.featureDataFetching">
                Полный контроль над получением данных
              </Translate>
            </li>
            <li>
              <Translate id="MainPage.Universal.featureUniversal">
                Безопасное выполнение серверного и клиентского кода
              </Translate>
            </li>
          </ul>
        </>
      }
    />
  );
}
