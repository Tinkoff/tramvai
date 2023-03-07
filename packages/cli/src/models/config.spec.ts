import { ConfigManager } from './config';

const syncConfigFile = jest.fn();

it('should populate defaults for config', () => {
  const config: any = {
    projects: {
      app: {
        name: 'test-app',
        root: 'src',
        type: 'application',
      },
      'child-app': {
        name: 'test-child-app',
        root: 'packages/child-app',
        type: 'child-app',
      },
    },
  };

  const configManager = new ConfigManager({ config, syncConfigFile });

  expect(configManager.config).toMatchInlineSnapshot(`
    {
      "projects": {
        "app": {
          "checkAsyncTs": false,
          "cssMinimize": "css-minimizer",
          "dedupe": {
            "enabled": true,
            "strategy": "equality",
          },
          "define": {
            "development": {},
            "production": {},
            "shared": {},
          },
          "enableFillActionNamePlugin": false,
          "experiments": {
            "minicss": {
              "useImportModule": true,
            },
            "serverRunner": "process",
            "transpilation": {
              "loader": "babel",
            },
            "webpack": {
              "backCompat": false,
              "cacheUnaffected": true,
            },
          },
          "externals": [],
          "fileSystemPages": {
            "enabled": false,
            "pagesDir": "pages",
            "routesDir": "routes",
          },
          "generateDataQaTag": false,
          "hotRefresh": {
            "enabled": true,
          },
          "modern": true,
          "name": "test-app",
          "notifications": {},
          "output": {
            "client": "dist/client",
            "server": "dist/server",
            "static": "dist/static",
          },
          "postcss": {},
          "root": "src",
          "serverApiDir": "src/api",
          "shared": {
            "deps": [],
          },
          "sourceMap": false,
          "splitChunks": {
            "commonChunkSplitNumber": 3,
            "granularChunksMinSize": 20000,
            "granularChunksSplitNumber": 2,
            "mode": "granularChunks",
          },
          "terser": {
            "parallel": true,
          },
          "transpileOnlyModernLibs": true,
          "type": "application",
          "webpack": {},
        },
        "child-app": {
          "cssMinimize": "css-minimizer",
          "dedupe": {
            "enabled": true,
            "strategy": "equality",
          },
          "define": {
            "development": {},
            "production": {},
            "shared": {},
          },
          "enableFillActionNamePlugin": false,
          "experiments": {
            "minicss": {
              "useImportModule": true,
            },
            "transpilation": {
              "loader": "babel",
            },
            "webpack": {
              "backCompat": false,
              "cacheUnaffected": true,
            },
          },
          "generateDataQaTag": false,
          "hotRefresh": {
            "enabled": true,
          },
          "name": "test-child-app",
          "notifications": {},
          "output": "dist/child-app",
          "postcss": {
            "cssLocalIdentName": "[hash:base64:5]",
          },
          "root": "packages/child-app",
          "shared": {
            "deps": [],
          },
          "sourceMap": false,
          "terser": {
            "parallel": true,
          },
          "transpileOnlyModernLibs": true,
          "type": "child-app",
          "webpack": {},
        },
      },
    }
  `);
});

it('should populate defaults for overridable options', () => {
  const config: any = {
    projects: {
      app: {
        name: 'test-app',
        root: 'src',
        type: 'application',
        output: {
          client: 'assets/compiled',
        },
        sourceMap: false,
        externals: ['test'],
        fileSystemPages: { enabled: true },
        experiments: {
          webpack: {
            backCompat: true,
          },
          transpilation: {
            loader: {
              development: 'swc',
            },
          },
        },
        dedupe: {
          strategy: 'semver',
        },
        define: {
          shared: {
            'process.env.APP_ID': 'app',
          },
        },
        svgo: {
          plugins: [
            {
              'test-plugin': true,
            },
          ],
        },
      },
      'child-app': {
        name: 'test-child-app',
        root: 'packages/child-app',
        type: 'child-app',
        sourceMap: {
          development: true,
        },
        experiments: {
          transpilation: {
            loader: {},
          },
        },
        define: {
          shared: {
            commonProp: 'unknown',
          },
          production: {
            'process.env.PROD': 'true',
          },
        },
        webpack: {
          resolveAlias: {
            stream: 'browser-stream',
          },
          provide: {
            Buffer: ['buffer', 'Buffer'],
          },
        },
      },
    },
  };

  const configManager = new ConfigManager({ config, syncConfigFile });

  expect(configManager.config).toMatchInlineSnapshot(`
    {
      "projects": {
        "app": {
          "checkAsyncTs": false,
          "cssMinimize": "css-minimizer",
          "dedupe": {
            "enabled": true,
            "strategy": "semver",
          },
          "define": {
            "development": {},
            "production": {},
            "shared": {
              "process.env.APP_ID": "app",
            },
          },
          "enableFillActionNamePlugin": false,
          "experiments": {
            "minicss": {
              "useImportModule": true,
            },
            "serverRunner": "process",
            "transpilation": {
              "loader": {
                "development": "swc",
                "production": "babel",
              },
            },
            "webpack": {
              "backCompat": true,
              "cacheUnaffected": true,
            },
          },
          "externals": [
            "test",
          ],
          "fileSystemPages": {
            "enabled": true,
            "pagesDir": "pages",
            "routesDir": "routes",
          },
          "generateDataQaTag": false,
          "hotRefresh": {
            "enabled": true,
          },
          "modern": true,
          "name": "test-app",
          "notifications": {},
          "output": {
            "client": "assets/compiled",
            "server": "dist/server",
            "static": "dist/static",
          },
          "postcss": {},
          "root": "src",
          "serverApiDir": "src/api",
          "shared": {
            "deps": [],
          },
          "sourceMap": false,
          "splitChunks": {
            "commonChunkSplitNumber": 3,
            "granularChunksMinSize": 20000,
            "granularChunksSplitNumber": 2,
            "mode": "granularChunks",
          },
          "svgo": {
            "plugins": [
              {
                "test-plugin": true,
              },
            ],
          },
          "terser": {
            "parallel": true,
          },
          "transpileOnlyModernLibs": true,
          "type": "application",
          "webpack": {},
        },
        "child-app": {
          "cssMinimize": "css-minimizer",
          "dedupe": {
            "enabled": true,
            "strategy": "equality",
          },
          "define": {
            "development": {},
            "production": {
              "process.env.PROD": "true",
            },
            "shared": {
              "commonProp": "unknown",
            },
          },
          "enableFillActionNamePlugin": false,
          "experiments": {
            "minicss": {
              "useImportModule": true,
            },
            "transpilation": {
              "loader": {
                "development": "babel",
                "production": "babel",
              },
            },
            "webpack": {
              "backCompat": false,
              "cacheUnaffected": true,
            },
          },
          "generateDataQaTag": false,
          "hotRefresh": {
            "enabled": true,
          },
          "name": "test-child-app",
          "notifications": {},
          "output": "dist/child-app",
          "postcss": {
            "cssLocalIdentName": "[hash:base64:5]",
          },
          "root": "packages/child-app",
          "shared": {
            "deps": [],
          },
          "sourceMap": {
            "development": true,
            "production": false,
          },
          "terser": {
            "parallel": true,
          },
          "transpileOnlyModernLibs": true,
          "type": "child-app",
          "webpack": {
            "provide": {
              "Buffer": [
                "buffer",
                "Buffer",
              ],
            },
            "resolveAlias": {
              "stream": "browser-stream",
            },
          },
        },
      },
    }
  `);
});
