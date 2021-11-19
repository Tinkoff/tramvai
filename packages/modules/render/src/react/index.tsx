import React from 'react';
import { Provider } from '@tramvai/state';
import { DIContext } from '@tramvai/react';
import { Root as RootComponent } from './root';

export function renderReact({ pageService, di }, context) {
  return (
    <Provider context={context}>
      <DIContext.Provider value={di}>
        <RootComponent pageService={pageService} />
      </DIContext.Provider>
    </Provider>
  );
}
