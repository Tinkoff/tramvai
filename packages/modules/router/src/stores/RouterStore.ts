import { createReducer, createEvent } from '@tramvai/state';
import type { Url } from '@tinkoff/url';
import type { NavigationRoute, Navigation } from '@tinkoff/router';

export const setCurrentNavigation = createEvent<Navigation>('SET_CURRENT_ROUTE');
export const setUrlOnRehydrate = createEvent<Url>('SET_URL_ON_REHYDRATE');

export interface RouterState {
  currentRoute: NavigationRoute;
  previousRoute: NavigationRoute;
  currentUrl: Url;
  previousUrl: Url;
}

const initialState: RouterState = {
  currentRoute: null,
  previousRoute: null,
  currentUrl: null,
  previousUrl: null,
};

export const RouterStore = createReducer('router', initialState)
  .on(setCurrentNavigation, (state, { to, from, url, fromUrl, replace }) => {
    // TODO: убедиться что все данные нам нужны из роутинга,
    // возможно всякие meta, content не нужны при дегидрации
    return {
      currentRoute: to,
      previousRoute: replace ? state.previousRoute : from,
      currentUrl: url,
      previousUrl: replace ? state.previousUrl : fromUrl,
    };
  })
  .on(setUrlOnRehydrate, (state, url) => {
    return {
      ...state,
      currentUrl: url,
    };
  });
