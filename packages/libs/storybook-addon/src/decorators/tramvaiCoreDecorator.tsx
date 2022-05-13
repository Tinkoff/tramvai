import { Provider } from '@tramvai/state';
import type { StoreClass } from '@tramvai/state';
import { DIContext } from '@tramvai/react';
import {
  CREATE_CACHE_TOKEN,
  ENV_MANAGER_TOKEN,
  LOGGER_TOKEN,
  REQUEST_MANAGER_TOKEN,
} from '@tramvai/tokens-common';
import type { ExtendedModule, ModuleType } from '@tramvai/core';
import { APP_INFO_TOKEN } from '@tramvai/core';
import type { Provider as DiProvider } from '@tinkoff/dippy';
import {
  createMockContext,
  createMockDi,
  createMockStore,
  createMockLogger,
  createMockEnvManager,
  createMockAppInfo,
  createMockRequestManager,
  createMockCache,
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
    modules: [...(parameters.tramvai?.modules ?? [])],
    providers: [
      {
        provide: LOGGER_TOKEN,
        useValue: createMockLogger(),
      },
      {
        provide: ENV_MANAGER_TOKEN,
        useValue: createMockEnvManager(),
      },
      {
        provide: APP_INFO_TOKEN,
        useValue: createMockAppInfo(),
      },
      {
        provide: REQUEST_MANAGER_TOKEN,
        useValue: createMockRequestManager(),
      },
      {
        provide: CREATE_CACHE_TOKEN,
        useValue: () => createMockCache(),
      },
      ...(parameters.tramvai?.providers ?? []),
    ],
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
