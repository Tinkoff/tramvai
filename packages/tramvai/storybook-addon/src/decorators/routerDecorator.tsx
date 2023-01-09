import { Provider as RouterProvider } from '@tinkoff/router';
import type { Route } from '@tinkoff/router';
import type { Url } from '@tinkoff/url';
import { createMockRouter } from '@tramvai/test-mocks';
import type { StorybookDecorator } from '../types';

export interface RouterDecoratorParameters {
  tramvai?: {
    currentRoute?: Route;
    currentUrl?: Url;
  };
}

export const RouterDecorator: StorybookDecorator<RouterDecoratorParameters> = (
  Story,
  { parameters }: { parameters: RouterDecoratorParameters }
) => {
  const routerMock = createMockRouter({
    currentRoute: parameters.tramvai?.currentRoute,
    currentUrl: parameters.tramvai?.currentUrl,
  });

  return (
    <RouterProvider router={routerMock}>
      <Story />
    </RouterProvider>
  );
};
