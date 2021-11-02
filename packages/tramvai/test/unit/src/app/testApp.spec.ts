import { NoSpaRouterModule } from '@tramvai/module-router';
import { commandLineListTokens, createApp, createBundle } from '@tramvai/core';
import { CommonModule, ENV_USED_TOKEN } from '@tramvai/module-common';
import { LogModule } from '@tramvai/module-log';
import { RenderModule } from '@tramvai/module-render';
import { ServerModule } from '@tramvai/module-server';
import { testApp } from './testApp';

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

const bundle = createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: () => 'rootPage',
    pageSecond: () => 'secondPage',
  },
});

describe('test/unit/app/testApp', () => {
  let testEnv: ThenArg<ReturnType<typeof testApp>>;
  describe('normal', () => {
    beforeAll(async () => {
      const app = createApp({
        name: 'unit-app',
        bundles: {
          mainDefault: () => Promise.resolve({ default: bundle }),
        },
        modules: [
          CommonModule,
          LogModule,
          RenderModule,
          ServerModule,
          NoSpaRouterModule.forRoot([
            {
              name: 'root',
              path: '/',
            },
            {
              name: 'other',
              path: '/second/',
              config: {
                pageComponent: 'pageSecond',
              },
            },
          ]),
        ],
        providers: [
          {
            provide: ENV_USED_TOKEN,
            multi: true,
            useValue: { key: 'FRONT_LOG_API', value: 'test' },
          },
        ],
      });

      testEnv = await testApp(app);
    });

    afterAll(() => {
      return testEnv.close();
    });

    it('should request to server', async () => {
      const { request } = testEnv;

      const response = await request('/').expect(200).expect('X-App-Id', 'unit-app');

      expect(response.text).toMatch('<html class="no-js" lang="ru">');
      expect(response.text).toMatch('<div class="application">rootPage</div>');
      expect(response.text).toMatch('<script>var initialState =');
    });

    it('should return render of page', async () => {
      const { render } = testEnv;

      const rootPage = await render('/');

      expect(rootPage.application).toEqual('rootPage');

      const secondPage = await render('/second/');

      expect(secondPage.application).toEqual('secondPage');
      expect(secondPage.initialState).toEqual({
        stores: expect.objectContaining({
          environment: {
            FRONT_LOG_API: 'test',
          },
          router: expect.objectContaining({
            currentUrl: expect.objectContaining({
              path: '/second/',
            }),
          }),
        }),
      });
    });

    it('should return mocker instance', async () => {
      const { mocker } = testEnv;

      expect(mocker).toBeDefined();
    });
  });

  describe('fail', () => {
    beforeAll(async () => {
      const app = createApp({
        name: 'unit-app',
        bundles: {
          mainDefault: () => Promise.resolve({ default: bundle }),
        },
        modules: [CommonModule, LogModule, RenderModule, ServerModule],
        providers: [
          {
            provide: commandLineListTokens.resolveUserDeps,
            multi: true,
            useFactory: ({ wrong }) => {
              return wrong.test();
            },
            deps: {
              wrong: '_unknown_provider',
            },
          },
        ],
      });

      testEnv = await testApp(app);
    });

    afterAll(() => {
      return testEnv.close();
    });

    it('render with 500 status should fail', async () => {
      const { render } = testEnv;

      await expect(render('/')).rejects.toThrowError(
        'Error: Token not found _unknown_provider at resolve_user_deps'
      );
    });
  });
});
