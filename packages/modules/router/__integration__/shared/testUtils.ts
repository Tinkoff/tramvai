import type puppeteer from 'puppeteer';

export const getRouteName = (page: puppeteer.Page) => {
  return page.evaluate(() => {
    return document.getElementById('route-name').innerText;
  });
};

export const getPageTitle = (page: puppeteer.Page) => {
  return page.evaluate(() => {
    return document.getElementById('page').innerText;
  });
};

export const getUrlPath = (page: puppeteer.Page) => {
  return page.evaluate(() => {
    return document.getElementById('url-path').innerText;
  });
};

export const getUseRoute = (page: puppeteer.Page) => {
  return page.evaluate(() => {
    return document.getElementById('use-route').innerText;
  });
};

export const checkIsSpa = (page: puppeteer.Page) => {
  let hasLoaded = false;

  page.on('load', () => {
    hasLoaded = true;
  });
  return () => {
    return !hasLoaded;
  };
};

export const checkLatestNavigationType = (page: puppeteer.Page) => {
  return page.evaluate(() => {
    return window.__LATEST_NAVIGATION_TYPE__;
  });
};

export const internalRouterStateFromDi = (page: puppeteer.Page) => {
  return page.evaluate(() => {
    return window.contextExternal.di.get('router router').lastNavigation;
  });
};

export const internalRouterStateFromState = (page: puppeteer.Page) => {
  return page.evaluate(() => {
    return window.contextExternal.getState().router;
  });
};
