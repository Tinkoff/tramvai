import { Provider } from '@tramvai/state';
import { DIContext } from '@tramvai/react';
import { Root as RootComponent } from './root';

export function renderReact({ di }, context) {
  const serverState = typeof window !== 'undefined' ? context.getState() : undefined;

  return (
    <Provider context={context} serverState={serverState}>
      <DIContext.Provider value={di}>
        <RootComponent />
      </DIContext.Provider>
    </Provider>
  );
}
