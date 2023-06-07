import { Provider } from '@tramvai/state';
import { DIContext } from '@tramvai/react';
import { INITIAL_APP_STATE_TOKEN } from '@tramvai/tokens-common';
import type { DI_TOKEN } from '@tinkoff/dippy';
import { Root as RootComponent } from './root';

export function renderReact({ di }: { di: typeof DI_TOKEN }, context) {
  const initialState = di.get({ token: INITIAL_APP_STATE_TOKEN, optional: true });

  return (
    <Provider context={context} serverState={initialState?.stores}>
      <DIContext.Provider value={di}>
        <RootComponent />
      </DIContext.Provider>
    </Provider>
  );
}
