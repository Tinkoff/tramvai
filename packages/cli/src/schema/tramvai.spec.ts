import Ajv from 'ajv';
import clone from '@tinkoff/utils/clone';
import { resolve } from 'path';
import { sync as requireResolve } from 'resolve';
import { schema } from './tramvai';

jest.mock('path');
jest.mock('resolve');

describe('JSON schema для tramvai.json', () => {
  it('Схема успешно компилируется', () => {
    const ajv = new Ajv();

    expect(() => ajv.compile(schema)).not.toThrow();
  });

  it('Базовая конфигурация проходит валидацию схемы', () => {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);

    const baseConfig = {
      projects: {
        app: {
          name: 'test-app',
          root: 'src/app',
          type: 'application',
          commands: {
            build: {
              options: {},
              configurations: {},
            },
            serve: {
              configurations: {},
              notifications: {},
            },
          },
        },
        module: {
          name: 'test-module',
          root: 'src/module',
          type: 'module',
          commands: {
            build: {
              options: {},
              configurations: {},
            },
            serve: {
              configurations: {},
              notifications: {},
            },
          },
        },
      },
    };

    const valid = validate(baseConfig);

    expect(valid).toBe(true);
    expect(validate.errors).toBe(null);
  });

  it('Применяет значения по умолчанию', () => {
    (resolve as any).mockReturnValue('mock');
    (requireResolve as any).mockReturnValue('mock');

    const config = {
      projects: {
        app: {
          name: 'test-app',
          root: 'src/app',
          type: 'application' as const,
        },
        module: {
          name: 'test-module',
          root: 'src/module',
          type: 'module' as const,
        },
      },
    };

    const originalConfig = clone(config);

    const ajv = new Ajv({ allErrors: true, useDefaults: true, strictDefaults: 'log' });
    const validate = ajv.compile(schema);
    const valid = validate(config);

    expect(valid).toBe(true);
    expect(config).not.toEqual(originalConfig);

    expect(config).toMatchInlineSnapshot(`
      Object {
        "projects": Object {
          "app": Object {
            "commands": Object {
              "build": Object {
                "configurations": Object {
                  "checkAsyncTs": false,
                  "commonChunk": true,
                  "commonChunkSplitNumber": 3,
                  "dedupe": "equality",
                  "definePlugin": Object {
                    "dev": Object {},
                    "prod": Object {},
                  },
                  "enableFillActionNamePlugin": false,
                  "experiments": Object {
                    "minicss": Object {
                      "useImportModule": true,
                    },
                    "transpilation": Object {
                      "loader": "babel",
                    },
                    "webpack": Object {
                      "backCompat": false,
                      "cacheUnaffected": true,
                    },
                  },
                  "externals": Array [],
                  "fileSystemPages": Object {
                    "enable": false,
                    "pagesDir": "pages",
                    "routesDir": "routes",
                  },
                  "generateDataQaTag": false,
                  "granularChunks": false,
                  "granularChunksMinSize": 20000,
                  "granularChunksSplitNumber": 2,
                  "modern": true,
                  "postcss": Object {
                    "config": "postcss.config",
                  },
                  "removeTypeofWindow": true,
                  "sourceMap": false,
                  "sourceMapServer": false,
                  "terserParallel": true,
                  "transpileOnlyModernLibs": true,
                },
                "options": Object {
                  "outputClient": "dist/client",
                  "outputServer": "dist/server",
                  "outputStatic": "dist/static",
                  "polyfill": "",
                  "server": "src/server",
                  "serverApiDir": "src/api",
                },
              },
              "serve": Object {
                "configurations": Object {
                  "experiments": Object {
                    "minicss": Object {
                      "useImportModule": true,
                    },
                    "serverRunner": "process",
                    "transpilation": Object {
                      "loader": "babel",
                    },
                    "webpack": Object {
                      "backCompat": false,
                      "cacheUnaffected": true,
                    },
                  },
                  "externals": Array [
                    "react$",
                    "react-dom",
                    "prop-types",
                    "express",
                    "core-js",
                  ],
                  "hotRefresh": false,
                  "modern": false,
                  "sourceMap": false,
                },
                "notifications": Object {},
              },
            },
            "name": "test-app",
            "root": "src/app",
            "type": "application",
          },
          "module": Object {
            "commands": Object {
              "build": Object {
                "configurations": Object {
                  "dedupe": "equality",
                  "definePlugin": Object {
                    "dev": Object {},
                    "prod": Object {},
                  },
                  "enableFillActionNamePlugin": false,
                  "experiments": Object {
                    "minicss": Object {
                      "useImportModule": true,
                    },
                    "transpilation": Object {
                      "loader": "babel",
                    },
                    "webpack": Object {
                      "backCompat": false,
                      "cacheUnaffected": true,
                    },
                  },
                  "fileSystemPages": Object {
                    "enable": false,
                    "pagesDir": "pages",
                    "routesDir": "routes",
                  },
                  "generateDataQaTag": false,
                  "modern": true,
                  "postcss": Object {
                    "config": "postcss.config",
                    "cssLocalIdentName": "[hash:base64:5]",
                  },
                  "removeTypeofWindow": true,
                  "sourceMap": false,
                  "sourceMapServer": false,
                  "terserParallel": true,
                  "transpileOnlyModernLibs": true,
                },
                "options": Object {
                  "output": "dist/modules",
                },
              },
              "serve": Object {
                "configurations": Object {
                  "experiments": Object {
                    "minicss": Object {
                      "useImportModule": true,
                    },
                    "transpilation": Object {
                      "loader": "babel",
                    },
                    "webpack": Object {
                      "backCompat": false,
                      "cacheUnaffected": true,
                    },
                  },
                  "hotRefresh": false,
                  "modern": false,
                  "sourceMap": false,
                },
                "notifications": Object {},
              },
            },
            "name": "test-module",
            "root": "src/module",
            "type": "module",
          },
        },
      }
    `);
  });
});
