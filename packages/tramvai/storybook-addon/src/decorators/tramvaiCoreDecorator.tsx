import { Provider } from '@tramvai/state';
import type { StoreClass } from '@tramvai/state';
import { DIContext } from '@tramvai/react';
import type { ExtendedModule, ModuleType } from '@tramvai/core';
import type { Provider as DiProvider } from '@tinkoff/dippy';
import {
  createMockContext,
  createMockDi,
  createMockStore,
  CommonTestModule,
} from '@tramvai/test-mocks';

export interface TramvaiCoreDecoratorParameters {
  tramvai?: {
    stores?: StoreClass[];
    initialState?: Record<string, any>;
    providers?: DiProvider[];
    modules?: Array<ModuleType | ExtendedModule>;
  };
}

export const TramvaiCoreDecorator = (
  Story,
  { parameters }: { parameters: TramvaiCoreDecoratorParameters }
) => {
  const storeMock = createMockStore({
    stores: parameters.tramvai?.stores,
    initialState: parameters.tramvai?.initialState,
  });
  const diMock = createMockDi({
    modules: [CommonTestModule, ...(parameters.tramvai?.modules ?? [])],
    providers: [...(parameters.tramvai?.providers ?? [])],
  });
  const contextMock = createMockContext({
    di: diMock,
    store: storeMock,
    useTramvaiActionsConditionals: true,
  });

  return (
    <Provider context={contextMock} serverState={parameters.tramvai?.initialState}>
      <DIContext.Provider value={diMock}>
        <Story />
      </DIContext.Provider>
    </Provider>
  );
};
