import React from 'react';
import { Provider } from '@tramvai/state';
import { DIContext } from '@tramvai/react';
import { Root as RootComponent } from './root';

export function renderReact({ componentRegistry, di }, context) {
  return (
    <Provider context={context}>
      <DIContext.Provider value={di}>
        <RootComponent componentRegistry={componentRegistry} />
      </DIContext.Provider>
    </Provider>
  );
}
