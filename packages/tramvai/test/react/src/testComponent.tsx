import React from 'react';
import type { RenderOptions } from '@testing-library/react';
import { render, act, fireEvent } from '@testing-library/react';
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
    renderOptions?: RenderOptions;
  };

export const testComponent = (
  element: React.ReactElement,
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
  return {
    render: render(
      <StateProvider context={context}>
        <DIContext.Provider value={context.di}>
          <RouterProvider router={router}>{element}</RouterProvider>
        </DIContext.Provider>
      </StateProvider>,
      renderOptions
    ),
    act,
    fireEvent,
    context,
    router,
  };
};
