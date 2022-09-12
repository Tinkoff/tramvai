import noop from '@tinkoff/utils/function/noop';

const supportsHtml5History =
  typeof window !== 'undefined' && window.history && window.history.pushState;

export interface Wrapper<T> {
  init(state: T): void;
  navigate(arg: { path: string; replace: boolean; state: T }): void;
  history(delta: number): void;

  subscribe(handler: (arg: { path: string; state: T }) => void): void;
}

interface NavigateHandler {
  (arg: { url: string; replace?: boolean; navigateState?: any }): void;
}

export const wrapHistory = <T>({ onNavigate }: { onNavigate: NavigateHandler }): Wrapper<T> => {
  if (!supportsHtml5History) {
    const navigate: History['pushState'] = (data, title, url) => {
      window.location.href = url.toString();
    };

    window.history.pushState = navigate;
    window.history.replaceState = navigate;

    return {
      navigate: ({ path }) => navigate({}, '', path),
      history: () => {
        throw new Error('Method not implemented');
      },
      init: noop,
      subscribe: noop,
    };
  }

  let browserHistory = window.history;

  if ('__originalHistory' in window.history) {
    browserHistory = (window.history as any).__originalHistory;
  } else {
    (window.history as any).__originalHistory = {
      pushState: browserHistory.pushState.bind(window.history),
      replaceState: browserHistory.replaceState.bind(window.history),
      go: browserHistory.go.bind(window.history),
    };
  }

  const pushState = browserHistory.pushState.bind(window.history);
  const replaceState = browserHistory.replaceState.bind(window.history);
  const go = browserHistory.go.bind(window.history);

  const navigate: Wrapper<T>['navigate'] = ({ path, replace, state }) => {
    if (replace) {
      replaceState(state, '', path);
    } else {
      pushState(state, '', path);
    }
  };

  const history: Wrapper<T>['history'] = (delta: number) => {
    go(delta);
  };

  const browserNavigate = (replace = false): History['pushState'] => {
    return (navigateState, title, url) => {
      onNavigate({ url: url.toString(), replace, navigateState });
    };
  };

  window.history.pushState = browserNavigate(false);
  window.history.replaceState = browserNavigate(true);
  window.history.go = history;
  window.history.back = () => history(-1);
  window.history.forward = () => history(1);

  return {
    navigate,
    history,
    init: (state: T) => {
      replaceState(state, '');
    },
    subscribe: (handler) => {
      window.addEventListener('popstate', ({ state }) => {
        handler({
          path: window.location.pathname + window.location.search + window.location.hash,
          state,
        });
      });
    },
  };
};
