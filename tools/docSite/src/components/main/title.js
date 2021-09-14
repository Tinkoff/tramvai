import React from 'react';
import Translate from '@docusaurus/Translate';

export function Title() {
  return (
    <div className="row padding--lg main-section">
      <div className="col">
        <h1 className="text--center text--primary">tramvai</h1>
        <h3 className="text--center text--primary">
          <Translate id="MainPage.Title.h3">
            Модульный фреймворк для создания универсальных React приложений
          </Translate>
        </h3>
      </div>
    </div>
  );
}
