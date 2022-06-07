import { Provider } from '@tramvai/state';
import { DIContext } from '@tramvai/react';
import { Root as RootComponent } from './root';
import { PageErrorBoundary } from './pageErrorBoundary';

export function renderReact({ pageService, di, initialState }, context) {
  return (
    <Provider context={context} serverState={initialState && context.getState()}>
      <DIContext.Provider value={di}>
        <PageErrorBoundary pageService={pageService}>
          <RootComponent pageService={pageService} />
        </PageErrorBoundary>
      </DIContext.Provider>
    </Provider>
  );
}
