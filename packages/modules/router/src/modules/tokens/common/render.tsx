import type { AbstractRouter } from '@tinkoff/router';
import { Provider } from '@tinkoff/router';

export const provideRouter = ({ router }: { router: AbstractRouter }) => {
  const serverState: Parameters<typeof Provider>[0]['serverState'] = {
    currentRoute: router.getCurrentRoute(),
    currentUrl: router.getCurrentUrl(),
  };
  return (render) => {
    return (
      <Provider router={router} serverState={serverState}>
        {render}
      </Provider>
    );
  };
};
