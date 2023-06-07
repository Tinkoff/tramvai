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

      test.expect(/\/scope\/manifest\.[\w\d]+?\.webmanifest$/.test(url)).toBe(true);
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
});
