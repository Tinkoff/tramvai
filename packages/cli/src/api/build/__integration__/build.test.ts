import { resolve } from 'path';
import { promises } from 'fs';
import { build } from '@tramvai/cli';

const FIXTURES_DIR = resolve(__dirname, '__fixtures__');

jest.useRealTimers();
jest.setTimeout(180000);

const normalizeFiles = (files: string[]) => {
  return files.map((file) => file.replace(/(\..+)(\..+)/, '$2')).sort();
};

describe('@tramvai/cli build command', () => {
  describe('application', () => {
    it('should build application by target', async () => {
      await build({
        rootDir: FIXTURES_DIR,
        target: 'app',
        resolveSymlinks: false,
      });

      const [clientFiles, serverFiles] = await Promise.all([
        promises.readdir(resolve(FIXTURES_DIR, 'dist/client')),
        promises.readdir(resolve(FIXTURES_DIR, 'dist/server')),
      ]);

      expect(normalizeFiles(clientFiles)).toMatchInlineSnapshot(`
Array [
  "platform.css",
  "platform.js",
  "src_api_build___integration_____fixtures___app_bundles_first_ts.js",
  "src_api_build___integration_____fixtures___app_bundles_main_ts.js",
  "src_api_build___integration_____fixtures___app_bundles_second_ts.js",
  "src_api_build___integration_____fixtures___app_bundles_third_ts.js",
  "stats.json",
]
`);

      expect(normalizeFiles(serverFiles)).toMatchInlineSnapshot(`
        Array [
          "server.css",
          "server.js",
          "stats.json",
        ]
      `);
    });

    it('should build application from config', async () => {
      await build({
        rootDir: FIXTURES_DIR,
        resolveSymlinks: false,
        config: {
          name: 'app',
          type: 'application',
          root: resolve(FIXTURES_DIR, 'app'),
          commands: {
            build: {
              options: {
                server: resolve(FIXTURES_DIR, 'app/server'),
              },
              configurations: {
                definePlugin: {
                  dev: {
                    IS_REACT_APP: true,
                  },
                },
              },
            },
          },
        },
      });

      const [clientFiles, serverFiles] = await Promise.all([
        promises.readdir(resolve(FIXTURES_DIR, 'dist/client')),
        promises.readdir(resolve(FIXTURES_DIR, 'dist/server')),
      ]);

      expect(normalizeFiles(clientFiles)).toMatchInlineSnapshot(`
Array [
  "platform.css",
  "platform.js",
  "src_api_build___integration_____fixtures___app_bundles_first_ts.js",
  "src_api_build___integration_____fixtures___app_bundles_main_ts.js",
  "src_api_build___integration_____fixtures___app_bundles_second_ts.js",
  "src_api_build___integration_____fixtures___app_bundles_third_ts.js",
  "stats.json",
]
`);

      expect(normalizeFiles(serverFiles)).toMatchInlineSnapshot(`
        Array [
          "server.css",
          "server.js",
          "stats.json",
        ]
      `);
    });
  });

  describe('module', () => {
    it('should build module by target', async () => {
      await build({
        rootDir: FIXTURES_DIR,
        target: 'module',
        resolveSymlinks: false,
      });

      const files = await promises.readdir(resolve(FIXTURES_DIR, 'dist/modules/module/prerelease'));

      expect(normalizeFiles(files)).toMatchInlineSnapshot(`
Array [
  "module.css",
  "module_client.js",
  "module_server.css",
  "module_server.js",
  "stats.json",
]
`);
    });

    it('should build module by specific config', async () => {
      await build({
        rootDir: FIXTURES_DIR,
        config: {
          type: 'module',
          name: 'module',
          root: resolve(FIXTURES_DIR, 'module'),
        },
      });

      const files = await promises.readdir(resolve(FIXTURES_DIR, 'dist/modules/module/prerelease'));

      expect(normalizeFiles(files)).toMatchInlineSnapshot(`
Array [
  "module.css",
  "module_client.js",
  "module_server.css",
  "module_server.js",
  "stats.json",
]
`);
    });
  });

  // TODO: тесты падают потому что какой-то рассинхрон при установке @tramvai/build
  describe.skip('package', () => {
    it('should build package by target', async () => {
      await build({
        rootDir: FIXTURES_DIR,
        target: 'package',
        resolveSymlinks: false,
      });

      const files = await promises.readdir(resolve(FIXTURES_DIR, 'dist'));

      expect(normalizeFiles(files)).toMatchInlineSnapshot(`
        Array [
          "browser.js",
          "browser.js",
          "index.js",
          "index.js",
        ]
      `);
    });

    it('should build package by specific config', async () => {
      await build({
        rootDir: FIXTURES_DIR,
        config: {
          type: 'package',
          name: 'package',
          root: resolve(FIXTURES_DIR),
        },
      });

      const files = await promises.readdir(resolve(FIXTURES_DIR, 'dist'));

      expect(normalizeFiles(files)).toMatchInlineSnapshot(`
        Array [
          "browser.js",
          "browser.js",
          "index.js",
          "index.js",
        ]
      `);
    });
  });
});
