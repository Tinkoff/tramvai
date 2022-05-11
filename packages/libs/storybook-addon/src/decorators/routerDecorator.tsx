import { Provider as RouterProvider } from '@tinkoff/router';
import type { Route } from '@tinkoff/router';
import type { Url } from '@tinkoff/url';
import { createMockRouter } from '@tramvai/test-mocks';

export interface RouterDecoratorParameters {
  currentRoute?: Route;
  currentUrl?: Url;
}

export const RouterDecorator = (
  Story,
  { parameters }: { parameters: RouterDecoratorParameters }
) => {
  const routerMock = createMockRouter({
    currentRoute: parameters.currentRoute,
    currentUrl: parameters.currentUrl,
  });

  return (
    <RouterProvider router={routerMock}>
      <Story />
    </RouterProvider>
  );
};
