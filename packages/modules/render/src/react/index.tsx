import { Provider } from '@tramvai/state';
import { DIContext } from '@tramvai/react';
import { Root as RootComponent } from './root';

export function renderReact({ pageService, di, initialState }, context) {
  return (
    <Provider context={context} serverState={initialState && context.getState()}>
      <DIContext.Provider value={di}>
        <RootComponent pageService={pageService} />
      </DIContext.Provider>
    </Provider>
  );
}
