import { Provider } from '@tramvai/state';
import type { StoreClass } from '@tramvai/state';
import { DIContext } from '@tramvai/react';
import type { ExtendedModule, ModuleType } from '@tramvai/core';
import type { Provider as DiProvider } from '@tinkoff/dippy';
import type { CommonModuleOptions } from '@tramvai/test-mocks';
import {
  createMockContext,
  createMockDi,
  createMockStore,
  CommonTestModule,
} from '@tramvai/test-mocks';
import type { StorybookDecorator } from '../types';

export interface TramvaiCoreDecoratorParameters {
  tramvai?: {
    stores?: StoreClass[];
    initialState?: Record<string, any>;
    providers?: DiProvider[];
    modules?: Array<ModuleType | ExtendedModule>;
    options?: CommonModuleOptions;
  };
}

export const TramvaiCoreDecorator: StorybookDecorator<TramvaiCoreDecoratorParameters> = (
  Story,
  { parameters }
) => {
  const envFromFile: Record<string, string> = process.env.TRAMVAI_ENV_FROM_FILE as any;

  const storeMock = createMockStore({
    stores: parameters.tramvai?.stores,
    initialState: parameters.tramvai?.initialState,
  });
  const diMock = createMockDi({
    modules: [
      CommonTestModule.forRoot({
        ...parameters.tramvai?.options,
        env: {
          ...envFromFile,
          ...parameters.tramvai?.options?.env,
        },
      }),
      ...(parameters.tramvai?.modules ?? []),
    ],
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
