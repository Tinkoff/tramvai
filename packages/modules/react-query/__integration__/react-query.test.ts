import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';
import { sleep } from '@tramvai/test-integration';

const { getApp } = testApp({
  name: 'react-query',
});
const { getPageWrapper } = testAppInBrowser(getApp);

describe('useQuery', () => {
  it('base', async () => {
    const render = await getApp().render('/use-query-base/');
    const { page } = await getPageWrapper('/use-query-base/');

    expect(render.application).toMatchInlineSnapshot(`"<div>loading...</div>"`);

    await page.waitForFunction(
      () => {
        return document.querySelector('.application > div')?.innerHTML !== 'loading...';
      },
      {
        timeout: 5000,
      }
    );

    expect(
      await page.$eval('.application', (application) => application.innerHTML)
    ).toMatchInlineSnapshot(`"<div>Hello, Mock!</div>"`);
  });

  it('prefetch', async () => {
    const render = await getApp().render('/use-query-prefetch/');

    expect(render.application).toMatchInlineSnapshot(`"<div>Hello, Mock!</div>"`);
  });

  it('fetch', async () => {
    const render = await getApp().render('/use-query-fetch/');

    expect(render.application).toMatchInlineSnapshot(`"<div>Hello, Mock!</div>"`);
  });

  it('query-parameters', async () => {
    const render = await getApp().render('/use-query-parameters/');
    const { page } = await getPageWrapper('/use-query-parameters/');

    expect(render.application).toMatchInlineSnapshot(`
      "
            <div>
              Child1:
              loading...
            </div>
          "
    `);

    await page.waitForFunction(
      () => {
        return document.querySelector('.application')?.innerHTML?.includes('Child3: test 2222');
      },
      {
        timeout: 5000,
      }
    );

    expect(
      await page.$eval('.application', (application) => application.innerHTML)
    ).toMatchInlineSnapshot(
      `"<div>Child1: <!-- -->test 1111</div><div>Child2: test 1111</div><div>Child3: test 2222</div>"`
    );
  });

  it('query-options', async () => {
    const { page } = await getPageWrapper('/use-query-options/');

    const empty = await page.$eval('.application > div', (div) => div.innerHTML);

    expect(empty).toBe('');

    await sleep(500);

    const num = await page.$eval('.application > div', (div) => div.innerHTML);

    expect(num).toMatch(/\d+/);

    await sleep(500);

    const nextNum = await page.$eval('.application > div', (div) => div.innerHTML);

    expect(num).not.toEqual(nextNum);
  });

  it('fail', async () => {
    const { page } = await getPageWrapper('/use-query-fail/');

    await page.waitForFunction(
      () => {
        return document.querySelector('.application > div')?.innerHTML !== 'loading...';
      },
      {
        timeout: 5000,
      }
    );

    expect(
      await page.$eval('.application', (application) => application.innerHTML)
    ).toMatchInlineSnapshot(
      `"<div>error: Что-то пошло не так. Мы уже решаем проблему. Попробуйте снова через несколько минут.</div>"`
    );
  });

  it('conditions', async () => {
    const { page } = await getPageWrapper('/use-query-conditions/');

    await page.waitForFunction(
      () => {
        return document.querySelector('.application > div')?.innerHTML !== 'loading...';
      },
      {
        timeout: 5000,
      }
    );

    expect(
      await page.$eval('.application', (application) => application.innerHTML)
    ).toMatchInlineSnapshot(`"<div>no-data</div>"`);
  });
});

describe('infiniteQuery', () => {
  it('base', async () => {
    const { page } = await getPageWrapper('/use-infinite-query/');

    await page.waitForFunction(
      () => {
        return document.querySelector('.application > div')?.innerHTML !== 'loading...';
      },
      {
        timeout: 5000,
      }
    );

    const button = await page.$('button');
    const divs = await page.$('.application > div > div');

    expect(await divs?.evaluate((element) => element.childElementCount)).toEqual(30);

    await button?.click();

    await sleep(200);

    expect(await divs?.evaluate((element) => element.childElementCount)).toEqual(60);
  });
});

describe('queries', () => {
  it('base', async () => {
    const { page } = await getPageWrapper('/use-queries/');

    expect(
      await page.$eval('.application > div', (application) => application.innerHTML)
    ).toMatchInlineSnapshot(`"<div>loading1...</div><div>loading2...</div>"`);

    await sleep(100);

    expect(
      await page.$eval('.application > div', (application) => application.innerHTML)
    ).toMatchInlineSnapshot(`"<div>loading1...</div><div>test 2222</div>"`);

    await sleep(200);

    expect(
      await page.$eval('.application > div', (application) => application.innerHTML)
    ).toMatchInlineSnapshot(`"<div>test 1111</div><div>test 2222</div>"`);
  });
});
