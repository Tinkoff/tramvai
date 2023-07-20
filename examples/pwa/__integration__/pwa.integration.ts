import { test } from './test-fixture';

test.describe('packages/modules/pwa', () => {
  test.describe('Service Worker', () => {
    test('should be registered with correct url', async ({ app, I, Pwa }) => {
      await I.gotoPage(`${app.serverUrl}/scope/`);

      test.expect(await Pwa.getSWUrl()).toBe('/scope/service-worker.modern.js');
    });

    test('should be registered with correct scope', async ({ app, I, Pwa }) => {
      await I.gotoPage(`${app.serverUrl}/scope/`);

      test.expect(await Pwa.getSWScope()).toBe('/scope/');
    });
  });

  test.describe('Webmanifest', () => {
    test('should be registered with correct url', async ({ app, I, Pwa }) => {
      await I.gotoPage(`${app.serverUrl}/scope/`);

      const url = await Pwa.getWebmanifestUrl();

      test.expect(/\/scope\/manifest\.webmanifest$/.test(url)).toBe(true);
    });

    test('proxy should work', async ({ app, I, Pwa }) => {
      await I.gotoPage(`${app.serverUrl}/scope/`);

      const content = await Pwa.fetchWebmanifest();

      test.expect(content.name).toBe('my manifest');
    });
  });

  test.describe('Meta', () => {
    test('should contain theme-color', async ({ app, I, Pwa }) => {
      await I.gotoPage(`${app.serverUrl}/scope/`);

      test.expect(await Pwa.getThemeColor()).toBe('#ffdd2d');
    });

    test('should contain viewport', async ({ app, I, Pwa }) => {
      await I.gotoPage(`${app.serverUrl}/scope/`);

      test.expect(await Pwa.getViewport()).toBe('width=device-width, initial-scale=1');
    });
  });

  test.describe('PWA recipes', () => {
    test('should cache static assets and pages', async ({ app, I, Pwa }) => {
      await I.gotoPage(`${app.serverUrl}/scope/`);

      const swResponses = await Pwa.getSWResponsesAfterReload();

      test
        .expect(
          swResponses
            .map((response) =>
              response
                .url()
                .replace(app.serverUrl, `\${SERVER_URL}`)
                .replace(app.staticUrl, `\${STATIC_URL}`)
            )
            .sort()
        )
        .toEqual([
          `\${SERVER_URL}/scope/`,
          `\${STATIC_URL}/dist/client/@_routes_scope_index.chunk.js`,
          `\${STATIC_URL}/dist/client/platform.js`,
          `\${STATIC_URL}/dist/client/react.js`,
          `\${STATIC_URL}/dist/client/tramvai-workbox-window.chunk.js`,
        ]);
    });
  });
});
