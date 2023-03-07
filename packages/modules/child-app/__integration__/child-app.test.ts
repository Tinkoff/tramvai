import { resolve } from 'path';
import { outputFile } from 'fs-extra';
import { start } from '@tramvai/cli';
import { fastify } from 'fastify';
import { fastifyReplyFrom } from '@fastify/reply-from';
import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';
import { getStaticUrl, sleep } from '@tramvai/test-integration';
import type { PromiseType } from 'utility-types';
import { getPort } from '@tramvai/internal-test-utils/utils/getPort';

const normalizeSuspense = (html: string) => {
  return html.replace(/<template .+><\/template>/gs, '<Suspense />');
};

const REFRESH_CMP_PATH = resolve(__dirname, 'child-app', 'base', '__temp__', 'cmp.tsx');

const REFRESH_CMP_CONTENT_START = `import React from 'react';

export const Cmp = () => {
  return <div id="cmp">Cmp test: start</div>;
};
`;

const REFRESH_CMP_CONTENT_UPDATE = `import React from 'react';

export const Cmp = () => {
  return <div id="cmp">Cmp test: update</div>;
};
`;

let childAppBase: PromiseType<ReturnType<typeof start>>;
let childAppState: PromiseType<ReturnType<typeof start>>;
let childAppReactQuery: PromiseType<ReturnType<typeof start>>;
let childAppError: PromiseType<ReturnType<typeof start>>;

beforeAll(async () => {
  await outputFile(REFRESH_CMP_PATH, REFRESH_CMP_CONTENT_START);

  [childAppBase, childAppState, childAppReactQuery, childAppError] = await Promise.all([
    start({
      port: 0,
      config: {
        type: 'child-app',
        root: resolve(__dirname, 'child-app', 'base'),
        name: 'base',
        hotRefresh: {
          enabled: true,
        },
      },
    }),
    start({
      port: 0,
      config: {
        type: 'child-app',
        root: resolve(__dirname, 'child-app', 'state'),
        name: 'state',
      },
    }),
    start({
      port: 0,
      config: {
        type: 'child-app',
        root: resolve(__dirname, 'child-app', 'react-query'),
        name: 'react-query',
        shared: {
          deps: ['@tramvai/react-query', '@tramvai/module-react-query'],
        },
      },
    }),
    start({
      port: 0,
      config: {
        type: 'child-app',
        root: resolve(__dirname, 'child-app', 'error'),
        name: 'error',
      },
    }),
  ]);
});

const mockerApp = fastify({
  logger: true,
});

const mockerPort = getPort();
const mockerHandlerMock = jest.fn();

beforeAll(async () => {
  await mockerApp.register(fastifyReplyFrom);

  await mockerApp.addHook('onRequest', async (req, reply) => {
    reply.header('Access-Control-Allow-Origin', '*');
  });
  await mockerApp.addHook('preHandler', async (...args) => mockerHandlerMock(...args));

  await mockerApp.get('/*', async (request, reply) => {
    const [_, childAppName, filename] = request.url.split('/');

    switch (childAppName) {
      case 'base':
      case 'base-not-preloaded':
        return reply.from(
          `${getStaticUrl(childAppBase)}/base/${filename.replace(/base-not-preloaded/, 'base')}`
        );

      case 'state':
        return reply.from(`${getStaticUrl(childAppState)}/state/${filename}`);

      case 'react-query':
        return reply.from(`${getStaticUrl(childAppReactQuery)}/react-query/${filename}`);

      case 'error':
        return reply.from(`${getStaticUrl(childAppError)}/error/${filename}`);
    }
  });

  await mockerApp.listen({ port: mockerPort });
});

const { getApp } = testApp(
  {
    name: 'root-app',
    config: {
      shared: {
        deps: ['@tramvai/react-query', '@tramvai/module-react-query'],
      },
      define: {
        development: {
          get 'process.env.CHILD_APP_BASE'() {
            return `"${getStaticUrl(childAppBase)}/"`;
          },
        },
      },
    },
  },
  {
    rootDir: __dirname,
    env: {
      CHILD_APP_EXTERNAL_URL: `http://localhost:${mockerPort}/`,
    },
  }
);
const { getPageWrapper } = testAppInBrowser(getApp);

const renderApp = async (page: string) => {
  const { application } = await getApp().render(page, { parserOptions: { comment: true } });

  return normalizeSuspense(application);
};

afterAll(async () => {
  await Promise.all([
    mockerApp.close(),
    childAppBase.close(),
    childAppState.close(),
    childAppReactQuery.close(),
    childAppError.close(),
  ]);
});

beforeEach(() => {
  mockerHandlerMock.mockReset();
});

describe('base', () => {
  afterAll(async () => {
    await outputFile(REFRESH_CMP_PATH, REFRESH_CMP_CONTENT_START);
  });

  it('should resolve child-app', async () => {
    const { request } = getApp();

    await request('/base/').expect(200);

    expect(await renderApp('/base/')).toMatchInlineSnapshot(`
      "
            <div>Content from root</div>
            <!--$-->
            <div id="base">
              Child App:
              <!-- -->I&#x27;m little child app
            </div>
            <div id="cmp">Cmp test: start</div>
            <!--/$-->
          "
    `);
  });

  it('react-refresh should work', async () => {
    const { page } = await getPageWrapper('/base/');

    expect(
      await page.$eval('#cmp', (node) => (node as HTMLElement).innerText)
    ).toMatchInlineSnapshot(`"Cmp test: start"`);

    await outputFile(REFRESH_CMP_PATH, REFRESH_CMP_CONTENT_UPDATE);

    await page.waitForFunction(
      () => {
        return document.getElementById('cmp')?.innerHTML !== 'Cmp test: start';
      },
      { polling: 2000, timeout: 10000 }
    );

    expect(
      await page.$eval('#cmp', (node) => (node as HTMLElement).innerText)
    ).toMatchInlineSnapshot(`"Cmp test: update"`);
  });
});

describe('base-not-preloaded', () => {
  it('should render child app only after page load', async () => {
    const { request } = getApp();

    await request('/base-not-preloaded/').expect(200);

    expect(await renderApp('/base-not-preloaded/')).not.toContain('Child App');

    const { page, router } = await getPageWrapper('/base-not-preloaded/');

    const getActionCount = () =>
      page.evaluate(() => (window as any).TRAMVAI_TEST_CHILD_APP_NOT_PRELOADED_ACTION_CALL_NUMBER);

    await page.waitForSelector('#base', {
      state: 'visible',
    });

    expect(await page.evaluate(() => document.querySelector('.application')?.innerHTML)).toContain(
      'Child App'
    );

    expect(await getActionCount()).toBe(1);

    router.navigate('/base/');

    expect(await getActionCount()).toBe(1);
  });
});

describe('state', () => {
  it('should resolve child-app', async () => {
    const { request } = getApp();

    await request('/state/').expect(200);

    expect(await renderApp('/state/')).toMatchInlineSnapshot(`
      "
            <h2>Root</h2>
            <div>
              Content from root, state:
              <!-- -->1
            </div>
            <button id="button" type="button">Update Root State</button>
            <h3>Child</h3>
            <!--$-->
            <div id="child-state">
              Current Value from Root Store:
              <!-- -->1
            </div>
            <!--/$-->
          "
    `);
  });

  it('should update internal state based on root', async () => {
    const { page } = await getPageWrapper('/state/');
    const childCmp = await page.$('#child-state');

    expect(
      await childCmp?.evaluate((node) => (node as HTMLElement).innerText)
    ).toMatchInlineSnapshot(`"Current Value from Root Store: 1"`);

    const button = await page.$('#button');

    await button?.click();

    await sleep(100);

    expect(
      await childCmp?.evaluate((node) => (node as HTMLElement).innerText)
    ).toMatchInlineSnapshot(`"Current Value from Root Store: 2"`);
  });

  it('should execute action for every transition', async () => {
    const { page, router } = await getPageWrapper('/state/');

    const getActionCount = () =>
      page.evaluate(() => (window as any).TRAMVAI_TEST_CHILD_APP_ACTION_CALLED_TIMES);

    expect(await getActionCount()).toBe(1);

    await router.navigate('/base/');

    expect(await getActionCount()).toBe(1);

    await router.navigate('/state/');

    expect(await getActionCount()).toBe(2);
  });
});

describe('react-query', () => {
  it('should work with react-query', async () => {
    const { request } = getApp();

    await request('/react-query/').expect(200);

    expect(await renderApp('/react-query/')).toMatchInlineSnapshot(`
      "
            <div>
              Content from root:
              <!-- -->test
            </div>
            <!--$-->
            <div>Hello, Mock!</div>
            <!--/$-->
          "
    `);
  });

  it('should reuse react-query dependencies from root-app', async () => {
    const { serverUrl } = getApp();
    const { page } = await getPageWrapper();

    const loadedScripts: string[] = [];

    page.on('request', (request) => {
      const url = request.url();
      const resourceType = request.resourceType();

      if (resourceType === 'script' && url.includes('/react-query/')) {
        loadedScripts.push(url);
      }
    });

    await page.goto(`${serverUrl}/react-query/`);

    // only runtime and main entry chunk should be loaded
    expect(loadedScripts).toHaveLength(2);
  });
});

describe('errors', () => {
  describe('error during loading child-app code', () => {
    beforeEach(() => {
      mockerHandlerMock.mockImplementation(() => {
        throw new Error('blocked');
      });
    });

    it('should render nothing', async () => {
      const { request } = getApp();

      const [_, application, { page }] = await Promise.all([
        request('/error/').expect(200),
        renderApp('/error/'),
        getPageWrapper('/error/'),
      ]);

      expect(application).toMatchInlineSnapshot(`
        "
              <div>Error page still works</div>
              <!--$!--><Suspense /><!--/$-->
            "
      `);

      expect(await page.locator('.application').innerHTML()).toMatchInlineSnapshot(
        `"<div>Error page still works</div><div><div style="text-align: center; margin-bottom: 11px; padding-top: 26px; font-size: 30px; line-height: 36px; font-weight: 200;">An error occurred :(</div><div style="text-align: center; margin-bottom: 17px; color: rgb(146, 153, 162); font-size: 20px; line-height: 24px;">Try <a href="">reloading the page</a></div></div>"`
      );
    });

    it('should render fallback', async () => {
      const { request } = getApp();

      const [_, application, { page }] = await Promise.all([
        request('/error/?fallback=').expect(200),
        renderApp('/error/?fallback='),
        getPageWrapper('/error/?fallback='),
      ]);

      expect(application).toMatchInlineSnapshot(`
        "
              <div>Error page still works</div>
              <!--$!--><Suspense />
              <div id="fallback">Fallback component</div>
              <!--/$-->
            "
      `);

      expect(await page.locator('.application').innerHTML()).toMatchInlineSnapshot(
        `"<div>Error page still works</div><div id="fallback">Error fallback</div>"`
      );
    });

    it('should render error on spa transition', async () => {
      const { page, router } = await getPageWrapper('/base/');

      await router.navigate('/error/');

      expect(await page.locator('.application').innerHTML()).toMatchInlineSnapshot(
        `"<!--$--><!--/$--><div>Error page still works</div><div><div style="text-align: center; margin-bottom: 11px; padding-top: 26px; font-size: 30px; line-height: 36px; font-weight: 200;">An error occurred :(</div><div style="text-align: center; margin-bottom: 17px; color: rgb(146, 153, 162); font-size: 20px; line-height: 24px;">Try <a href="">reloading the page</a></div></div>"`
      );
    });

    it('should render error fallback on spa transition', async () => {
      const { page, router } = await getPageWrapper('/base/');

      await router.navigate('/error/?fallback=');

      expect(await page.locator('.application').innerHTML()).toMatchInlineSnapshot(
        `"<!--$--><!--/$--><div>Error page still works</div><div id="fallback">Error fallback</div>"`
      );
    });
  });

  describe('error during loading child-app code on server side', () => {
    beforeEach(() => {
      mockerHandlerMock.mockImplementation((req) => {
        if (req.url === '/error/error_server@0.0.0-stub.js') {
          throw new Error('blocked');
        }
      });
    });

    it('should render nothing', async () => {
      const { request } = getApp();

      const [_, application, { page }] = await Promise.all([
        request('/error/').expect(200),
        renderApp('/error/'),
        getPageWrapper('/error/'),
      ]);

      expect(application).toMatchInlineSnapshot(`
        "
              <div>Error page still works</div>
              <!--$!--><Suspense /><!--/$-->
            "
      `);

      expect(await page.locator('.application').innerHTML()).toMatchInlineSnapshot(
        `"<div>Error page still works</div><div id="error">Child App</div>"`
      );
    });

    it('should render fallback', async () => {
      const { request } = getApp();

      const [_, application, { page }] = await Promise.all([
        request('/error/?fallback=').expect(200),
        renderApp('/error/?fallback='),
        getPageWrapper('/error/?fallback='),
      ]);

      expect(application).toMatchInlineSnapshot(`
        "
              <div>Error page still works</div>
              <!--$!--><Suspense />
              <div id="fallback">Fallback component</div>
              <!--/$-->
            "
      `);

      expect(await page.locator('.application').innerHTML()).toMatchInlineSnapshot(
        `"<div>Error page still works</div><div id="error">Child App</div>"`
      );
    });

    it('should render component on spa transition', async () => {
      const { page, router } = await getPageWrapper('/base/');

      await router.navigate('/error/');

      expect(await page.locator('.application').innerHTML()).toMatchInlineSnapshot(
        `"<!--$--><!--/$--><div>Error page still works</div><div id="error">Child App</div>"`
      );
    });
  });

  describe('error during loading child-app code on client side', () => {
    beforeEach(() => {
      mockerHandlerMock.mockImplementation((req) => {
        if (req.url === '/error/error_client@0.0.0-stub.js') {
          throw new Error('blocked');
        }
      });
    });

    it('should render nothing', async () => {
      const { request } = getApp();

      const [_, application, { page }] = await Promise.all([
        request('/error/').expect(200),
        renderApp('/error/'),
        getPageWrapper('/error/'),
      ]);

      expect(application).toMatchInlineSnapshot(`
        "
              <div>Error page still works</div>
              <!--$-->
              <div id="error">Child App</div>
              <!--/$-->
            "
      `);

      expect(await page.locator('.application').innerHTML()).toMatchInlineSnapshot(
        `"<div>Error page still works</div><div><div style="text-align: center; margin-bottom: 11px; padding-top: 26px; font-size: 30px; line-height: 36px; font-weight: 200;">An error occurred :(</div><div style="text-align: center; margin-bottom: 17px; color: rgb(146, 153, 162); font-size: 20px; line-height: 24px;">Try <a href="">reloading the page</a></div></div>"`
      );
    });

    it('should render fallback', async () => {
      const { request } = getApp();

      const [_, application, { page }] = await Promise.all([
        request('/error/?fallback=').expect(200),
        renderApp('/error/?fallback='),
        getPageWrapper('/error/?fallback='),
      ]);

      expect(application).toMatchInlineSnapshot(`
        "
              <div>Error page still works</div>
              <!--$-->
              <div id="error">Child App</div>
              <!--/$-->
            "
      `);

      expect(await page.locator('.application').innerHTML()).toMatchInlineSnapshot(
        `"<div>Error page still works</div><div id="fallback">Error fallback</div>"`
      );
    });

    it('should render error on spa transition', async () => {
      const { page, router } = await getPageWrapper('/base/');

      await router.navigate('/error/');

      expect(await page.locator('.application').innerHTML()).toMatchInlineSnapshot(
        `"<!--$--><!--/$--><div>Error page still works</div><div><div style="text-align: center; margin-bottom: 11px; padding-top: 26px; font-size: 30px; line-height: 36px; font-weight: 200;">An error occurred :(</div><div style="text-align: center; margin-bottom: 17px; color: rgb(146, 153, 162); font-size: 20px; line-height: 24px;">Try <a href="">reloading the page</a></div></div>"`
      );
    });

    it('should render error fallback on spa transition', async () => {
      const { page, router } = await getPageWrapper('/base/');

      await router.navigate('/error/?fallback=');

      expect(await page.locator('.application').innerHTML()).toMatchInlineSnapshot(
        `"<!--$--><!--/$--><div>Error page still works</div><div id="fallback">Error fallback</div>"`
      );
    });
  });

  describe('error during render', () => {
    it('error both on server and client', async () => {
      const { request } = getApp();

      const [_, application, { page }] = await Promise.all([
        request('/error/?renderError=all').expect(200),
        renderApp('/error/?renderError=all'),
        getPageWrapper('/error/?renderError=all'),
      ]);

      expect(application).toMatchInlineSnapshot(`
        "
              <div>Error page still works</div>
              <!--$!--><Suspense /><!--/$-->
            "
      `);

      expect(await page.locator('.application').innerHTML()).toMatchInlineSnapshot(
        `"<div>Error page still works</div><div><div style="text-align: center; margin-bottom: 11px; padding-top: 26px; font-size: 30px; line-height: 36px; font-weight: 200;">An error occurred :(</div><div style="text-align: center; margin-bottom: 17px; color: rgb(146, 153, 162); font-size: 20px; line-height: 24px;">Try <a href="">reloading the page</a></div></div>"`
      );
    });

    it('error both on server and client with fallback', async () => {
      const { request } = getApp();

      const [_, application, { page }] = await Promise.all([
        request('/error/?renderError=all&fallback=').expect(200),
        renderApp('/error/?renderError=all&fallback='),
        getPageWrapper('/error/?renderError=all&fallback='),
      ]);

      expect(application).toMatchInlineSnapshot(`
        "
              <div>Error page still works</div>
              <!--$!--><Suspense />
              <div id="fallback">Fallback component</div>
              <!--/$-->
            "
      `);

      expect(await page.locator('.application').innerHTML()).toMatchInlineSnapshot(
        `"<div>Error page still works</div><div id="fallback">Error fallback</div>"`
      );
    });

    it('error only on server-side', async () => {
      const { request } = getApp();

      const [_, application, { page }] = await Promise.all([
        request('/error/?renderError=server').expect(200),
        renderApp('/error/?renderError=server'),
        getPageWrapper('/error/?renderError=server'),
      ]);

      expect(application).toMatchInlineSnapshot(`
        "
              <div>Error page still works</div>
              <!--$!--><Suspense /><!--/$-->
            "
      `);

      expect(await page.locator('.application').innerHTML()).toMatchInlineSnapshot(
        `"<div>Error page still works</div><div id="error">Child App</div>"`
      );
    });

    it('error only on server-side with fallback', async () => {
      const { request } = getApp();

      const [_, application, { page }] = await Promise.all([
        request('/error/?renderError=server&fallback=').expect(200),
        renderApp('/error/?renderError=server&fallback='),
        getPageWrapper('/error/?renderError=server&fallback='),
      ]);

      expect(application).toMatchInlineSnapshot(`
        "
              <div>Error page still works</div>
              <!--$!--><Suspense />
              <div id="fallback">Fallback component</div>
              <!--/$-->
            "
      `);

      expect(await page.locator('.application').innerHTML()).toMatchInlineSnapshot(
        `"<div>Error page still works</div><div id="error">Child App</div>"`
      );
    });

    it('error only on client-side', async () => {
      const { request } = getApp();

      const [_, application, { page }] = await Promise.all([
        request('/error/?renderError=client').expect(200),
        renderApp('/error/?renderError=client'),
        getPageWrapper('/error/?renderError=client'),
      ]);

      expect(application).toMatchInlineSnapshot(`
        "
              <div>Error page still works</div>
              <!--$-->
              <div id="error">Child App</div>
              <!--/$-->
            "
      `);

      expect(await page.locator('.application').innerHTML()).toMatchInlineSnapshot(
        `"<div>Error page still works</div><div><div style="text-align: center; margin-bottom: 11px; padding-top: 26px; font-size: 30px; line-height: 36px; font-weight: 200;">An error occurred :(</div><div style="text-align: center; margin-bottom: 17px; color: rgb(146, 153, 162); font-size: 20px; line-height: 24px;">Try <a href="">reloading the page</a></div></div>"`
      );
    });

    it('error only on client-side with fallback', async () => {
      const { request } = getApp();

      const [_, application, { page }] = await Promise.all([
        request('/error/?renderError=client&fallback=').expect(200),
        renderApp('/error/?renderError=client&fallback='),
        getPageWrapper('/error/?renderError=client&fallback='),
      ]);

      expect(application).toMatchInlineSnapshot(`
        "
              <div>Error page still works</div>
              <!--$-->
              <div id="error">Child App</div>
              <!--/$-->
            "
      `);

      expect(await page.locator('.application').innerHTML()).toMatchInlineSnapshot(
        `"<div>Error page still works</div><div id="fallback">Error fallback</div>"`
      );
    });
  });
});
