import React from 'react';
import type { FC } from 'react';
import type { RenderOptions } from '@testing-library/react';
import { render, act, fireEvent } from '@testing-library/react';
import { Provider as StateProvider } from '@tramvai/state';
import { DIContext } from '@tramvai/react';
import type { CONTEXT_TOKEN } from '@tramvai/tokens-common';
import type { AbstractRouter } from '@tinkoff/router';
import { Provider as RouterProvider } from '@tinkoff/router';
import type { createMockDi } from '@tramvai/test-mocks';
import { createMockContext, createMockRouter } from '@tramvai/test-mocks';
import { waitRaf } from '@tramvai/test-jsdom';

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
  const Wrapper: FC<{ children?: React.ReactNode }> = ({ children }) => (
    <StateProvider context={context} serverState={initialState}>
      <DIContext.Provider value={context.di}>
        <RouterProvider router={router} serverState={initialState?.router}>
          {children}
        </RouterProvider>
      </DIContext.Provider>
    </StateProvider>
  );

  const renderResults = render(<Wrapper>{element}</Wrapper>, renderOptions);

  return {
    render: renderResults,
    rerender: (el: React.ReactElement) => renderResults.rerender(<Wrapper>{el}</Wrapper>),
    act: (callback: () => Promise<void> | void) => {
      return act(async () => {
        await callback();
        if (typeof window.requestAnimationFrame !== 'undefined') {
          // as some of the state changes in browsers uses requestAnimationFrame to batch updates in single one
          // but in tests requestAnimationFrame should mostly should be resolved manually
          await waitRaf();
        }
      });
    },
    fireEvent,
    context,
    router,
  };
};
