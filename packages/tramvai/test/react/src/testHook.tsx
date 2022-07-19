import React from 'react';
import type { RenderHookOptions } from '@testing-library/react-hooks';
import { renderHook, act } from '@testing-library/react-hooks';
import { Provider as StateProvider } from '@tramvai/state';
import { DIContext } from '@tramvai/react';
import type { CONTEXT_TOKEN } from '@tramvai/tokens-common';
import type { AbstractRouter } from '@tinkoff/router';
import { Provider as RouterProvider } from '@tinkoff/router';
import type { createMockDi } from '@tramvai/test-mocks';
import { createMockContext, createMockRouter } from '@tramvai/test-mocks';

type OptionsDi = Parameters<typeof createMockDi>[0];
type OptionsContext = Parameters<typeof createMockContext>[0];

type OptionsRouter = Parameters<typeof createMockRouter>[0];
type Options = OptionsDi &
  OptionsContext &
  OptionsRouter & {
    context?: typeof CONTEXT_TOKEN;
    router?: AbstractRouter;
    renderOptions?: RenderHookOptions<any>;
  };

export const testHook = <TProps, TResult>(
  hookCallback: (props: TProps) => TResult,
  {
    providers,
    initialState,
    store,
    stores,
    di,
    context = createMockContext({ initialState, providers, di, store, stores }),
    currentRoute,
    currentUrl,
    router = createMockRouter({ currentRoute, currentUrl }),
    renderOptions,
  }: Options = {}
) => {
  const Wrapper = renderOptions?.wrapper ?? (({ children }) => children);

  const { result, rerender } = renderHook(hookCallback, {
    ...renderOptions,
    wrapper: ({ children }: { children?: React.ReactNode }) => {
      return (
        <StateProvider context={context} serverState={initialState}>
          <DIContext.Provider value={context.di}>
            <RouterProvider router={router} serverState={initialState?.router}>
              <Wrapper>{children}</Wrapper>
            </RouterProvider>
          </DIContext.Provider>
        </StateProvider>
      );
    },
  });

  return {
    result,
    rerender,
    act,
    context,
    router,
  };
};
